import React from "react";
import "./Chat.scss";
import Formsy from "formsy-react";
import FormsyTextArea from "../_components/customFormFields/FormsyTextArea";
import { authenticationService } from "../_services/authentication.service";


const Chat = (props) => {
	const { chat } = props;
	const userId = authenticationService.getId();

	return (
		<div className="Chat">
			{ chat && <>
				<h3>Discussion about: {chat.about.title}</h3>
				<ul>
					{chat.messages.map((msg, index) => (
						<li key={index} className={`message ${msg.sentBy === userId ? "blue" : "orange"}`}>
							<div>
								{msg.message}
							</div>
						</li>	
					))}
				</ul>
				<Formsy className="reply"
						onSubmit={(data, resetFn) => props.onMessageSubmit(data, resetFn, props.chat)}
				>
					<FormsyTextArea
						className="textArea"
						name="message"
						type="text"
						placeholder="Type here..."
						required
						value=""
					/>
					<button className="submitButton" type="submit">Send</button>
				</Formsy>
			</>}
		</div>
	)
};


export default Chat;