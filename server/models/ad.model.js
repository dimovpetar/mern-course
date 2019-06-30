const { model, Schema } = require("mongoose");

const adSchema = new Schema({
	title: { 
		type: String, 
		required: true
	},
    category: {
		type: String,
		required: true 
	},
    description: { 
		type: String,
		required: true 
	},
	price: {
		type: Number,
		required: true
	},
	images: {
		type: [String]
	},
	location: {
		required: true,
		type: String,
	},
	telephone: {
		type: String,
	},
	archived: {
		type: Boolean,
		default: false
	},
	createdBy: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	createdAt: {
		type: Date
	}
});

// make title and description searchable by $text operator
adSchema.index({
	title: "text",
	description: "text"
});

adSchema.pre("save", function(next) {

	if (!this.createdAt) {
		this.createdAt = Date.now();
	}

	next();
});


module.exports = model("Ad", adSchema);

