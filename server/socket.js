const { authenticateSocket } = require("./middlewares/authenticate.middleware");
const onlineClients = new Map(); // [userId, userSocket] pairs
const Chat = require("./models/chat.model");
const Message = require("./models/message.model").messageModel;
const ObjectId = require("mongoose").Types.ObjectId;

function markUserOnline(socket) {

	console.error(`UserID: ${socket.user.userId}, SocketID: ${socket.id}`)
	
	if (!onlineClients.get(socket.user.userId)) {
		console.log(`User "${socket.user.username}" connected.`);	
	}

	// the userId wont change, but the socket.id might change on reconnection, so update it
	onlineClients.set(socket.user.userId, socket.id);	
	console.log("Currently logged users:", onlineClients.size);
}

/**
 * 
 * @param socket The instance of the socket holding information for the current user.
 * @param {Function} cb A callback function with 'error' and 'data' arguments.
 */
function getAllMessages(socket, cb) {
	
	const userId = socket.user.userId;

	Chat.find({ $or: [{ user1: userId }, { user2: userId }]})
		.populate("user1", "username")
		.populate("user2", "username")
		.populate("about", "title")
		.lean()
		.then(data => {

			const modifiedData = data.map(chat => {
				const otherUser = chat.user1._id === ObjectId(userId) ? chat.user2 : chat.user1;

				chat.id = chat._id;
				delete (chat._id);
				chat.from = {
					username: otherUser.username,
					id: otherUser._id,
				}


				chat.about.id = chat.about._id;
				// delete (chat.about._id);

				return chat;
			});
			
			cb(null , modifiedData);
		})
		.catch(err => {
			cb(err);
		});
}

function addMessage(senderSocket, data, cb, io) {
	const { id, receiverId, sentAt, about,  } = data;
	const senderId = senderSocket.user.userId;
	let query;

	if (id) {
		query = { _id : id };
	} else {
		query = {
			user1: senderId,
			user2: receiverId,
			about: about 
		};
	}

	const message = new Message({
		message: data.message,
		sentBy: senderId
	});

	Chat.findOneAndUpdate(
		query,
		{ $push: { messages: message }, $set: { lastMessageAt: sentAt } },
		{ upsert: true, new: true }
	).populate("user1", "username")
		.populate("user2", "username	")
		.populate("about", "title")
		.lean()
		.then(instance => {

			instance.id = instance._id;
			delete (instance._id);

			cb(null, instance);

			// if the receiver is online notify him
			const receiverSocketId = onlineClients.get(receiverId);
			if (receiverSocketId && receiverSocketId !== senderSocket.id) {
				io.to(receiverSocketId).emit("newMessage", instance );
			}
		})
		.catch(err => {
			console.log(err)
			cb("Sending failed");
		});
}

function initSocketSubscriptions(io) {

	io.use(authenticateSocket);

	io.on("connection", function (socket) {

		markUserOnline(socket);

		socket.on("message", (data, cb) => {
			// cb("gsho", "pesho")
			addMessage(socket, data, cb, io);
		});

		socket.on("getAllMessages", (cb) => {
			getAllMessages(socket, cb);
		});

		socket.on("disconnect", function() {
			onlineClients.delete(socket.user.userId);
			console.log(`User "${socket.user.username}" disconnected.`);
			console.log("Currently logged users: ", onlineClients.size);
		});
	});
}

module.exports = initSocketSubscriptions;