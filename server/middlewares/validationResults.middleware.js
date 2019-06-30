const { validationResult } = require("express-validator/check");

function checkValidationResult (req, res, next) {

	const errors = validationResult(req);

	// if errors occured during validation, send the first one
	if (!errors.isEmpty()) {	
		const [error, ] = errors.array();
		return res.status(422).send(error.msg);
	}

	// no validation errors
	next();
}

module.exports = {
	checkValidationResult
};