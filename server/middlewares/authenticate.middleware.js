const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {

	let token = req.headers["x-access-token"] || req.headers["authorization"];
	if (token.startsWith('Bearer ')) {
	  // Remove Bearer from string
	  token = token.slice(7, token.length);
	}

    if (!token) {
       	res.sendStatus(403);
    } else {
        jwt.verify(token, "secret",  function(error, decoded) {
            if(error) {
				res.sendStatus(403);
            } else {
                req.user = {
					userId: decoded.id
				}

                next();
            }
        });
    }
}

function authenticateSocket(socket, next) {

	let token = socket.request.headers["x-access-token"] || socket.request.headers["authorization"];

	if (token.startsWith('Bearer ')) {
	  // Remove Bearer from string
	  token = token.slice(7, token.length);
	}

    if (!token) {
       	next(new Error("Authentication token is missing"));
    } else {
        jwt.verify(token, "secret", function(error, decoded) {
            if(error) {
				next(new Error("Authentication error"));
            } else {
                socket.user = {
					userId: decoded.id,
					username: decoded.username
				}

                next();
            }
        });
    }
}


module.exports = {
	authenticate,
	authenticateSocket
};