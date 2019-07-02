const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
	message: {
		required: true,
		type: String,
	},
	sentAt: {
		type: Date,
		default: Date.now()
	},
	sentBy: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = {
	messageSchema: messageSchema,
	messageModel: model("Message", messageSchema)
};

