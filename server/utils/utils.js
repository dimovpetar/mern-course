function getKeyByValue(map, value) {
	return	[...map.entries()]
				.filter(([k, v]) =>  v === value)
				.map(([k, v]) => k)[0];
}

module.exports = {
	getKeyByValue
}