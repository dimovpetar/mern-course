const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");
const { checkValidationResult } = require("../middlewares/validationResults.middleware");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/users/register", [
		check("username").isString().withMessage("Username should be provided."),
		check("email").isEmail().withMessage("Valid email should be provided."),
		check("password").isString().withMessage("Valid password should be provided.")
	], checkValidationResult, function (req, res) {

	User.create(req.body)
		.then(instance => {
			res.status(200).send("Successful registration");
		})
		.catch(err => {

			// take one validation error if such
			if (err.errors) {
				const errorKeys = Object.keys(err.errors);
				const message = err.errors[errorKeys[0]].message;
				res.status(422).send(message);
			} else {
				res.status(500).send("Please try again later.")
			}
		});
});

router.post("/users/login", [
		check("username").isString().withMessage("Username should be provided."),
		check("password").isString().withMessage("Valid password should be provided.")
	], checkValidationResult, function (req, res) {

	const data = req.body;

	User.findOne({ username: data.username }).exec()
		.then(instance => {

			if (!instance) {
				return res.status(422).send(`Could not find username ${data.username}.`);
			}

			if (!bcrypt.compareSync(data.password, instance.password)) {
				return res.status(401).send("Wrong password.");
			}

			// sign token with secret
			const token = jwt.sign({ 
				username: instance.username,
				id: instance._id
			}, "secret");

			return res.status(200).send({
				username: instance.username,
				id: instance._id,
				token: token
			});
		})
		.catch(err => {
			return res.status(500).send("Please try again later.")
		});
});

module.exports = router;