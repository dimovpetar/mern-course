function debounce(func, wait) {

	let timeout;

	return function(...args) {
		const context = this;
debugger
		clearTimeout(timeout);
		debugger
		timeout = setTimeout(() => func.apply(context, args), wait);
	}
}

export {
	debounce
}