const { model, Schema } = require("mongoose");

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
    messages: { 
		type: [String]
	}
});

chatSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = model("Chat", chatSchema);

