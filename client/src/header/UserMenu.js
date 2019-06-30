import React, { Component } from "react";
import "./UserMenu.scss";
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import { authenticationService } from "../_services/authentication.service";

class UserMenu extends Component {
	render() {
		const username = JSON.parse(localStorage.getItem("currentUser")).username;

		return (
			<Popup 
				trigger={
					<Link className="UserProfile" to="/myaccount/ads">
						<img className="avatar" src="/assets/images/profileDefault.png" alt="profile"/>
						<span className="userName">{username}</span>
					</Link>
				} 
				position="bottom right"
				on="hover"
				closeOnDocumentClick={false}>

				<div className="UserMenu">
					<ul >
						<li><Link to="/myaccount/ads">My Ads</Link></li>
						<li><Link to="/myaccount/messages">Messages</Link></li>
						<li onClick={() => {authenticationService.logout()}}>Log out</li>
					</ul>
				</div>
			</Popup>
		);
	}
}

export default UserMenu;