import React, { Component } from "react";
import "./MessagesCount.scss";
import { Link } from "react-router-dom";
import messageService from "../_services/message.service";

class MessagesCount extends Component {
	constructor() {
		super();
		this.state = {
			count: 0,
			unreadChats: []
		};

		this.onMessageReceived = this.onMessageReceived.bind(this);
	}

	componentDidMount() {
		if (messageService.io) {
			messageService.io.on("newMessage", this.onMessageReceived);
		}
	}

	componentWillUnmount() {
		if (messageService.io) {
			messageService.io.off("newMessage", this.onMessageReceived);
		}
	}

	onMessageReceived(chat) {
		if (this.state.unreadChats.indexOf(chat.id) < 0) {
			const unreadChatsCopy = [...this.state.unreadChats, chat.id];

			this.setState({
				count: this.state.count + 1,
				unreadChats: unreadChatsCopy
			});
		}
	}

	render() {
		return (
			<Link className="MessagesCount" to="/myaccount/messages">	
				<i className="far fa-comment fa-flip-horizontal"/>
				{!!this.state.count && <div className="counter">{this.state.count}</div>}
			</Link>
		);
	}
}

export default MessagesCount;