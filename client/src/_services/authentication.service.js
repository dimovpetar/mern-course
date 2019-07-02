import axios from "axios";

export const authenticationService = {
    login,
	logout,
	register,
	isLoggedIn,
	getId
};

function login(data) {
    const requestOptions = {
        headers: { "Content-Type": "application/json" }
	};
	
    return axios.post("/users/login", data, requestOptions)
		.then(response => {
			// store user details and jwt token in local storage to keep user logged in between page refreshes
			// contains: username, token
			localStorage.setItem("currentUser", JSON.stringify(response.data));

			return response;
		});
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
	window.location.reload();
}

function register(data) {

	const requestOptions = {	
        headers: { "Content-Type": "application/json" }
	};

    return axios.post("/users/register", data, requestOptions);
}

function isLoggedIn() { 
	return !!localStorage.getItem("currentUser");
}

function getId() {
	return JSON.parse(localStorage.getItem("currentUser")).id;
}