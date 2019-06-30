function pickFromObject(obj, values) {

	return values.reduce(function(o, key) {

		if (obj[key]) {
			o[key] = obj[key]; 
		}

		return o; 
	}, {});
}

export {
	pickFromObject
}