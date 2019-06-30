const express = require("express");
const app = express();
const path  = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const initSocketSubscriptions = require("./socket");
const port = 9000;
const rootPath = path.normalize(__dirname);

// import routers
const adsRouters = require("./routes/ads.routes");
const imagesRouters = require("./routes/images.routes");
const usersRouters = require("./routes/users.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

// set app variables
app.set("app", path.join(rootPath, "app"));

// add middlewares
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// set routes
app.use(express.static(path.join(rootPath, "../client/build")));
app.use(adsRouters);
app.use(imagesRouters);
app.use(usersRouters);
app.get("/", function (req, res) {
	res.sendFile(path.join(rootPath, "../client/build/index.html"));
});

// app.use(function(req, res, next) {
//     const err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

app.use(errorHandler);

const dburl = "mongodb://localhost:27017/myproject";

mongoose.connect(dburl, {
		useNewUrlParser: true,
		useFindAndModify: false
	})
	.then(() => {

		console.log("Connected to database!");

    	server.listen(port, err => {
			if (err) {
				throw err;
			};

			console.log(`Blog API is listening on port ${port}`);
			initSocketSubscriptions(io);
		});
	})
	.catch(err => { 
		console.error("Error: MongoDB not available. Check that it is started on port 27017.")
    	throw err;
	});