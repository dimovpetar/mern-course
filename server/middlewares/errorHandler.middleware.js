// a default error handler
function errorHandler(err, req, res, next) {
	console.error("Error: ", err);

	res.status(err.status || 500);
    res.json({
        errorMessage: err.message,
        error: err.error || err | {}
    });
}

module.exports = errorHandler;