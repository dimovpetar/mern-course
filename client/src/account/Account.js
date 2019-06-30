import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Messages from "./Messages";
import Ads from "./Ads";
import "./Account.scss";

class Account extends Component {
	render() {
		const { match, location: { pathname } } = this.props; 	

		const menuItems = [
			{ key: "myaccount", text: "My Ads", to: "/myaccount/ads"},
			{ key: "messages", text: "Messages", to: "/myaccount/messages"},
			{ key: "logout", text: "Log out", to: "/"},
		];

		return (
			<div className="Account">
				<h2 className="title">My Account</h2>
				<div className="container">
					<div className="sideMenu">
						<ul>
							{
								menuItems.map((item) => {
									return (
										<li 
											key={item.key}
											className={`${item.to !== "/" && pathname.includes(item.to) && "active"}`}
										>
											<Link to={item.to}>{item.text}</Link>
										</li>
									)
								})
							}					
						</ul>
					</div>
					<div className="main">
						<Switch>
							{/* Ads is the default view inside the user account */}
							<Route path={`${match.url}/ads`} component={Ads}/>
							<Route path={`${match.url}/messages`} component={Messages}/>
						</Switch>
					</div>
				</div>
			</div>
		);
	}
}

export default Account;