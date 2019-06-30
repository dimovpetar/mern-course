const multer = require("multer");
const path = require("path");
const ACCEPTED_FILES_EXTENSIONS = ["jpg", "jpeg", "png"];

const multipleImagesUpload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			const uploadsPath = path.join(__dirname, "../uploads/ads");
			cb(null, uploadsPath);
		},
		filename: (req, file, cb) => {
			let customFileName = Date.now().toString(), //crypto.randomBytes(18).toString("hex"),
				fileExtension = file.originalname.split(".")[1]; // get file extension from original file name
			cb(null, customFileName + "." + fileExtension);
		}
	}),
	limits: {
		fileSize: 1 * 1024 * 1024 // maximum 1 MB per file
	},
	fileFilter (req, file, cb) {
		// if the file extension is in our accepted list
		if (ACCEPTED_FILES_EXTENSIONS.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }

        // otherwise, return error
        return cb(new Error("Only " + ACCEPTED_FILES_EXTENSIONS.join(", ") + " files are allowed!"));
	}
}).array("images");

module.exports = {
	multipleImagesUpload
};


