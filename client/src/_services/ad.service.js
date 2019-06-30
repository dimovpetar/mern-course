import axios from "axios";

export const adService = {
	getAd,
	create,
	update,
	edit,
	getMostRecent,
	find,
	getOwnAds,
	set,
	_delete
};

function getAd(id) {

	const requestOptions = {
        headers: { 
			"Content-Type": "application/json",
		}
	};

	return axios.get(`/ad/${id}`, requestOptions);

}

function create(formData) {
	
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.post("/ad/create", formData, {
		headers: { 
			"content-type": "multipart/form-data",
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}

function edit(id) {
	
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.get(`/ad/create/${id}`, {
		headers: { 
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}

function update(id, formData) {
	
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.put(`/ad/create/${id}`, formData, {
		headers: { 
			"content-type": "multipart/form-data",
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}

function getMostRecent() {
	return axios.get("/ads");
}

function find(params) {
	return axios.get("/ads", { params: params });
}

function getOwnAds() {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.get("/user/ads", {
		headers: { 
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}

function set(adId, params) {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.put(`/ad/${adId}`, params, {
		headers: { 
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}

function _delete(adId) {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	return axios.delete(`/ad/${adId}`, {
		headers: { 
			"Authorization": `Bearer ${currentUser.token}`
		}
	});
}