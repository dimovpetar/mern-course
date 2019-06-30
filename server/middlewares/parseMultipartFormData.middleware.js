const multer = require("multer");

const parseMultipartFormData = multer().any();

module.exports = {
	parseMultipartFormData
};