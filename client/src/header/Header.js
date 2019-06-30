import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Header.scss";
import UserMenu from "./UserMenu";
import { authenticationService } from "../_services/authentication.service";
import Messages from "./Messages";

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoggedIn: authenticationService.isLoggedIn()
		}

		this.onCreateNewAdPress = this.onCreateNewAdPress.bind(this);
	}

	onCreateNewAdPress() {
		this.props.history.push("/create");
	}

    render() {
		const { location } = this.props;	
		const onCreatePage = location.pathname === "/create";

        return (
            <header className="Header">
				<Link to="/" className="homeButton" style={{textDecoration: "none"}}>
					<i className="fas fa-home" />
				</Link>
				<div className="settingsContainer">
					{!this.state.isLoggedIn &&
						<div className="logIn">
							<Link className="/register" to="/login">	
								Log in
							</Link>
						</div>	
					}
					{this.state.isLoggedIn &&
						<div className="wrapper">
							<Messages />
							<UserMenu />
						</div>
					}
					{!onCreatePage && 
						<button type="button" className="createNewAd" onClick={this.onCreateNewAdPress}>
						+ CREATE ADVERTISEMENT</button>
					}
				</div>
            </header>
        );
    }
}

export default withRouter(Header);