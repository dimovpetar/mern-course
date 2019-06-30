const { model, Schema } = require("mongoose");
const uniqueErrorFormatter = require("../utils/dbUniqueErrorFormatter");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
	username: { 
		type: String, 
		required: true,
		unique: true
	},
    email: {
		type: String,
		unique: true,
		required: true 
	},
    password: { 
		type: String,
		required: true 
	}
});

userSchema.plugin(uniqueErrorFormatter, {
	username: "Username is already taken",
	email: "Email is already in use"
});

userSchema.pre("save", function(next) {
	bcrypt.hash(this.password, 10)
		.then(encryptedPassword => {
			this.password = encryptedPassword;
			next();
		})
		.catch(err => {
			next(err);
		});
});

module.exports = model("User", userSchema);

