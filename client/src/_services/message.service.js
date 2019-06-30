import socketIOClient from "socket.io-client";
import { authenticationService } from "./authentication.service";

// The first time that this module is required, a connection will be established.
// This connection will be reused later on.
class socketIo {
	_io = null;
	_isConnected = false;

	constructor() {
		this._connect();
	}

	get io() {
		this._connect();
		return this._io;
	}

	set io(newValue) {
		this._io = newValue;
	}

	_connect() {

		if (this._isConnected) {
			return;
		}

		if (!authenticationService.isLoggedIn()) {
			return;
		}

		const currentUser = JSON.parse(localStorage.getItem("currentUser"));

		this._io = socketIOClient(window.location.origin, {
			transportOptions: {
				polling: {
					extraHeaders: {
						Authorization: `Bearer ${currentUser.token}`
					}
				}
			}
		});

		this._io.on("connect", () => {
			this._isConnected = true;
		});
	}
};

const instance = new socketIo();

export default instance;