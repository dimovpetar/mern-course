const express = require("express");
const Ad = require("../models/ad.model");
const { check, query } = require("express-validator/check");
const { checkValidationResult } = require("../middlewares/validationResults.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const router = express.Router();
const multipleImagesUpload = require("../utils/imageUpload").multipleImagesUpload;
const { unlinkFilesAsync } = require("../utils/filesOperations");
const path = require("path");
const ADS_DIR_NAME = path.join(__dirname, "../uploads/ads/");

router.post("/ad/create",
	authenticate,
	multipleImagesUpload,
	[
		check("title").exists(),
		check("category").exists(),
		check("description").exists(),
		check("price").exists(),
		check("location").exists()
	],
	checkValidationResult, 
	function (req, res) {

		const fileNames = req.files.map(file => { return file.filename; });
		const data = {
			...req.body,
			images: fileNames,
			createdBy: req.user.userId
		};

		Ad.create(data)
			.then(instance => {
				res.status(201).json({
					id: instance._id
				});
			})
			.catch(err => {
				// delete files if already saved
				unlinkFilesAsync(fileNames)
					.then(() => {
						res.status(500).send(err);
					});
			});
});

router.get("/ad/create/:id", authenticate, function (req, res) {

	const adId = req.params.id;
	const userId = req.user.userId;

	Ad.findById(adId)
		.then(instance => {

			if (!instance) {
				res.sendStatus(404);
			}

			if (instance.createdBy.equals(userId)) {
				res.status(200).json({
					title: instance.title,
					category: instance.category,
					price: instance.price,
					description: instance.description,
					telephone: instance.telephone,
					images: instance.images,
					location: instance.location,
					createdBy: instance.createdBy.username
				});
			} else {
				res.sendStatus(401);
			}
		})
		.catch(err => {
			res.sendStatus(404);
		});
});

router.put("/ad/create/:id",
	authenticate, 
	multipleImagesUpload,
	[
		check("title").exists(),
		check("category").exists(),
		check("description").exists(),
		check("price").exists(),
		check("location").exists()
	],
	checkValidationResult,
	function(req, res) {

		const newImagesNames = req.files.map(file => { return file.filename; });
		let imagesToDelete = [];
		let updatedImages = [...newImagesNames];

		if (req.body.previousImages) {
			// ensure we are working with arrays
			if (typeof req.body.previousImages === "string") {
				req.body.previousImages = [req.body.previousImages];
			}

			updatedImages = [...req.body.previousImages, ...updatedImages]
		}

		if (req.body.imagesToDelete) {
			if (typeof req.body.imagesToDelete === "string") {
				req.body.imagesToDelete = [req.body.imagesToDelete]
			}

			imagesToDelete = [...req.body.imagesToDelete];
		} 
		
		const updates = {
			...req.body,
			images: updatedImages
		};

		delete (updates.imagesToDelete);
		delete (updates.previousImages);
		
		const { id } = req.params;
		const { userId } = req.user;

		Ad.findOneAndUpdate(
			{ _id: id, createdBy: userId }, 
			{ $set: updates },	
			{ new: true }
		).exec()
			.then(instance => {
	
				if (!instance) {
					return res.sendStatus(404);
				}

				return unlinkFilesAsync(imagesToDelete, ADS_DIR_NAME);
			})
			.then(() => {
				res.status(200).send("Updates saved");
			})
			.catch(err => {
				res.sendStatus(404);
			});
});

router.get("/ad/:id", function(req, res) {
	const { id } = req.params;

	Ad.findOne({_id: id, archived: { $ne: true } })
		.populate("createdBy", "username")
		.then(instance => {

			if (!instance) {
				return res.sendStatus(404);
			}

			res.status(200).json({
				title: instance.title,
				category: instance.category,
				price: instance.price,
				description: instance.description,
				telephone: instance.telephone,
				images: instance.images,
				createdBy: instance.createdBy.username,
				createdById: instance.createdBy._id,
				createdAt: instance.createdAt,
				id: instance._id
			});
		})
		.catch(err => {
			res.sendStatus(404);
		});
});

function createFindCondtions(query) {
	let conditions = {};

	if (query.keyword) {
		// search text by regex
		var r = new RegExp(query.keyword, "i");

		conditions.$text = { $search: r };
	}

	if (query.category) {
		conditions.category = query.category;
	}

	if (query.priceFrom) {
		conditions.price = {
			$gte: query.priceFrom
		}
	}

	if (query.priceTo) {
		conditions.price = conditions.price || {};
		conditions.price.$lte = query.priceTo;
	}

	if (query.location) {
		conditions.location = query.location;
	}

	// search only ads that are not archived
	conditions.archived = { $ne: true };

	return conditions;
}

router.get("/ads",
	[
		query("keyword").optional().isString(),
		query("category").optional().isString(),
		query("priceFrom").optional().isNumeric(),
		query("priceTo").optional().isNumeric(),
		query("location").optional().isString()
	],
	checkValidationResult,
	function(req, res) {

		const conditions = createFindCondtions(req.query);
	
		Ad.find(conditions)
			.sort({ createdAt: -1 })
			.limit(30)
			.then(ads => {

				ads = ads.map(ad => {
					return {
						id: ad._id,
						title: ad.title,
						price: ad.price,
						img: ad.images[0]
					}
				});

				res.status(200).json(ads);
			})
			.catch(err => {
				res.sendStatus(501);
			});
});

router.get("/user/ads", authenticate, function(req, res) {

	Ad.find({ createdBy: req.user.userId })
		.then(ads => {
			ads = ads.map(ad => {
				return {
					id: ad._id,
					title: ad.title,
					price: ad.price,
					img: ad.images[0],
					createdAt: ad.createdAt,
					archived: ad.archived
				}
			});

			res.status(200).json(ads);
		})
		.catch(err => {
			res.sendStatus(501);
		});
});

router.put("/ad/:id", authenticate, function (req, res) {
	
	const { userId } = req.user;
	const { id } = req.params;
	const archive = !!req.body.archive;
	

	Ad.findOneAndUpdate(	
		{ _id: id, createdBy: userId }, 
		{ $set: { archived: archive } },	
		{ new: true }
	).exec()
		.then(instance => {
	
			if (!instance) {
				return res.sendStatus(404);
			}

			res.status(200).send("Updates saved");

		})
		.catch(err => {
			res.sendStatus(404);
		});
});

router.delete("/ad/:id", authenticate, function (req, res) {
	const { id } = req.params;
	const { userId } = req.user;

	Ad.findOneAndDelete({ _id: id, createdBy: userId })
		.then(instance => {
			return unlinkFilesAsync(instance.images, ADS_DIR_NAME);
		})
		.then(() => {
			res.sendStatus(200);
		})
		.catch(err => {
			res.sendStatus(501);
		});
});


module.exports = router;