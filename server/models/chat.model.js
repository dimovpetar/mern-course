const { model, Schema } = require("mongoose");
const messageSchema = require("./message.model").messageSchema;

const chatSchema = new Schema({
	user1: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	user2: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	about: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "Ad"
	},
    messages: { 
		type: [messageSchema]
	},
	lastMessageAt: {
		type: Date,
		default: Date.now()
	}
});

chatSchema.index({ "user1": 1, "user2": 1, "about": 1 }, { unique: true });

module.exports = model("Chat", chatSchema);

