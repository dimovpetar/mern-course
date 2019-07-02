import React, { Component } from "react";
import "./MessageForm.scss";
import Formsy from "formsy-react";
import FormsyTextArea from "../_components/customFormFields/FormsyTextArea";
import LoadingOverlay from "react-loading-overlay";
import messageService from "../_services/message.service";
import { authenticationService } from "../_services/authentication.service";

class MessageForm extends Component {

    constructor(props) {
		super(props);
		
		this.state = {
			isSending: false,
			isValid: false,
			message: "",
			isLoggedIn: authenticationService.isLoggedIn()
		};
	
		this.handleSubmit = this.handleSubmit.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.disableButton = this.disableButton.bind(this);	
	}

	handleSubmit(formValues) {
		const { message } = formValues;
		const { adOwnerId } = this.props;

		this.setState({
			isSending: true
		});

		const data = {
			message: message,
			receiverId: adOwnerId,
			about: this.props.adId,
			sentAt: Date.now()
		};

		messageService.io.emit("message", data, function (errorMsg, successMsg) {

			this.setState({
				isSending: false,
				message: errorMsg ? errorMsg : "Message sent!"
			});

			this.messageForm.reset();
		}.bind(this));
	}

	enableButton() {
		this.setState({ isValid: true });
	}

	disableButton() {
		this.setState({ isValid: false });
	}

    render() {
        return (
			<LoadingOverlay active={this.state.isSending} spinner>
				<div className="MessageForm">
					{!this.state.isLoggedIn && <h4>Log in to send a message to the seller</h4>}
					{this.state.isLoggedIn && <h4>Send a message to the seller</h4>}
					<span>{this.state.message}</span>
					<Formsy
						onValidSubmit={this.handleSubmit} 
						onValid={this.enableButton} 
						onInvalid={this.disableButton}
						ref={(event) => { this.messageForm = event; }}
					>
						<FormsyTextArea 
							name="message"
							type="text"
							placeholder="Hello, I would like to ..."
							required
							disabled={!this.state.isLoggedIn}
							value=""
						/>
						<button className="submitButton" type="submit" disabled={!this.state.isValid}>
							<i className="fa fa-home"></i> Send
						</button>
					</Formsy>
				</div>
			</LoadingOverlay>
        );
    }
}

export default MessageForm;
