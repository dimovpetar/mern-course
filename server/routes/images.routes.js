const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/images/ads/:imageId", function (req, res) {

	const { imageId } = req.params;
	const filePath= path.join(__dirname, `../uploads/ads/${imageId}`)
	const readStream = fs.createReadStream(filePath);	

	readStream.on("open", function () {
		readStream.pipe(res);
	});

	// This catches any errors that happen while creating the readable stream
	readStream.on("error", function(err) {
		res.sendStatus(404);
	});
});

module.exports = router;