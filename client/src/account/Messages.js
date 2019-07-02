import React, { Component } from "react";
import "./Messages.scss";
import messageService from "../_services/message.service";
import moment from "moment";
import { Switch, Link, Route } from "react-router-dom";
import Chat from "../messages/Chat";

class Messages extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: []
		}

		this.appendNewMessageInChat = this.appendNewMessageInChat.bind(this);
		this.onRowClick = this.onRowClick.bind(this);
		this.onSpecificRouteMatched = this.onSpecificRouteMatched.bind(this);
		this.onMessageSubmit = this.onMessageSubmit.bind(this);
	}

	componentDidMount() {

		// subscribe to incoming messages while on this page
		if (messageService.io) {

			// 1st get all messages
			messageService.io.emit("getAllMessages", (error, data) => {

				if (error) {
					console.log(error);
					return;
				}

				data.forEach(message => this.appendNewMessageInChat(message));
			});
	
			messageService.io.on("newMessage", this.appendNewMessageInChat);
		}
	}

	componentWillUnmount() {
		if (messageService.io) {
			messageService.io.off("newMessage", this.appendNewMessageInChat);
		}
	}

	appendNewMessageInChat(message) {

		const chats = [...this.state.chats];
	
		// if the chat already exists
		const chat = this.findChatById(chats, message.id);
		if (chat) {
			chat.messages = message.messages;
		} else {
			chats.push(message);
		}

		this.setState({
			chats: chats
		});
	}

	onRowClick(chatId) {
		this.props.history.push(`${this.props.match.path}/${chatId}`);
	}

	onSpecificRouteMatched(args) {
		const id = args.match.params.id;
		const chat = this.findChatById(this.state.chats, id);

		return (
			<Chat chat={chat} onMessageSubmit={this.onMessageSubmit}/>
		);
	}

	onMessageSubmit({ message }, resetFn, chat) {
	
		const data = {
			message: message,
			id: chat.id,
			sentAt: Date.now()
		};
		
		if (messageService.io) {
			messageService.io.emit("message", data, function (errorMsg, message) {
				resetFn();
				this.appendNewMessageInChat(message);
			}.bind(this));
		}
	}

	findChatById(arr, id) {
		return arr.find(el => el.id === id);
	}

	render() {
		const { match } = this.props; 	
		const { chats } = this.state;

		return (
			<div className="Messages">
				<Switch>
					<Route exact path={`${match.path}`} render={() => (
						<>	
							<h2 className="header">Messages</h2>
							<table className="content">
								<colgroup>
									<col width="20%"/>
									<col width="20%"/>
									<col width="auto"/>
									<col width="20%"/>
								</colgroup>
								<thead>
									<tr>
										<th><span>About</span></th>
										<th><span>From</span></th>
										<th><span>Last Message</span></th>
										<th><span>Date</span></th>
									</tr>
								</thead>
								<tbody>
									{chats.map((chat, index) => {
										return (
											<tr key={index} className="tableRow" onClick={e => this.onRowClick(chat.id)}>
												<td>	
													<Link to={`/ad/${chat.about.id}`} 	
														onClick={(e) => e.stopPropagation()}
														className="about"
													>
														{chat.about.title}
													</Link>
												</td>
												<td>{chat.from.username}</td>
												<td>{chat.messages[chat.messages.length - 1].message}</td>	
												<td>{moment(chat.lastMessageAt).format('MMMM Do, h:mm a')}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</>
					)}/>
					<Route exact path={`${match.path}/:id`} render={(args) => {
						return this.onSpecificRouteMatched(args);
					}}/>
				</Switch>
			</div>
		);
	}
}

export default Messages;