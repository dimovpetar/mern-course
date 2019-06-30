import React, { Component } from "react";
import "./Messages.scss";
import { Link } from "react-router-dom";
import messageService from "../_services/message.service";

class Messages extends Component {
	constructor() {
		super();
		this.state = {
		  	count: 0
		};
	}

	componentDidMount() {
		if (messageService.io) {
			messageService.io.on("newMessage", data => {
				this.setState({ count: this.state.count + 1 });
			});
		}
	}

	render() {
		return (
			<Link className="HeaderMessages" to="/myaccount/messages">	
				<i className="far fa-comment fa-flip-horizontal"/>
				{!!this.state.count && <div className="counter">{this.state.count}</div>}
			</Link>
		);
	}
}

export default Messages;