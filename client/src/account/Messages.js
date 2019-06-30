import React, { Component } from "react";
import "./Messages.scss";
import messageService from "../_services/message.service";

class Messages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: []
		}
	}

	render() {

		const { chats } = this.state;
		
		return (
			<div className="Messages">
				<h2 className="header">Messages</h2>
				<table className="content">
					<colgroup>
						<col width="20%"/>
						<col width="auto"/>
						<col width="20%"/>
					</colgroup>
					<thead>
						<tr>
							<th>
								<span>Sender</span>
							</th>
							<th>
								<span>Last message</span>
							</th>
							<th>
								<span>Date</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{chats.map((chat, index) => {
							return (
								<tr key={index}>
									<td>{chat.createdAt}</td>
									<td>
				
									</td>

									<td>
							
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Messages;