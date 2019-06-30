const { authenticateSocket } = require("./middlewares/authenticate.middleware");
const onlineClients = new Map(); // [userId, userSocket] pairs
const Chat = require("./models/chat.model");
const { getKeyByValue } = require("./utils/utils");


function addMessage(sender, data, io) {
	const { message, receiverId } = data;

	const senderId = getKeyByValue(onlineClients, sender.id);

	Chat.findOneAndUpdate(
		{ user1: senderId, user2: receiverId },
		{ $push: { messages: message } },
		{ upsert: true, new: true }
	).then(instance => {
		sender.emit("messageSent");

		// if the receiver is online notify him
		const receiverSocketId = onlineClients.get(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", { hello: "world" });
		}
	})
	.catch(err => {
		sender.emit("messageFailed");
	});
}

function initSocketSubscriptions(io) {

	io.use(authenticateSocket);

	io.on("connection", function (socket) {
		console.log(`User ${socket.user.username} connected.`);
		console.log("Currently logged users: ", onlineClients.size);

		onlineClients.set(socket.user.userId, socket.id);

		socket.emit("newMessage", { hello: "world" });
		socket.emit("newMessage", { hello: "world" });
		socket.emit("newMessage", { hello: "world" });

		socket.on("message", (data) => {
			addMessage(socket, data, io);
		});

		socket.on("disconnect", function() {
			onlineClients.delete(socket.user.userId);
			console.log(`User ${socket.user.username} disconnected.`);
			console.log("Currently logged users: ", onlineClients.size);
		});
	});
}

module.exports = initSocketSubscriptions;