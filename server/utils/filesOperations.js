const fs = require("fs");
const util = require("util");
const unlinkPromise = util.promisify(fs.unlink);

function unlinkFilesAsync(fileNames, dirName) {

	const unlinkPromises = fileNames.map(fileName => { 
		let name = fileName;

		if (dirName) {
			name = dirName + "/" + fileName;
		}

		return unlinkPromise(name);
	});

	return Promise.all(unlinkPromises);
}


module.exports = {
	unlinkFilesAsync
}