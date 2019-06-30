import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Auth.scss';
import { authenticationService } from "../_services/authentication.service";
import Formsy from "formsy-react";
import FormsyInput from "../_components/customFormFields/FormsyInput";
import LoadingOverlay from 'react-loading-overlay';


export default class Register extends Component {
    constructor(props) {
		super(props);

		// redirect to home if already logged in
		if (authenticationService.isLoggedIn()) { 
			this.props.history.push('/');
		}

        this.state = {
			errorReason: "",
			isLoading: false
		};
		
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(data) {
		this.setState({
			isLoading: true
		});
	
		authenticationService.register(data)
			.then((response) => {
				this.props.history.push({
					pathname: '/login',
					state: { message: 'success' }
				});
			})
			.catch((error) => {	
				this.setState({
					errorReason: error.response.data,
					isLoading: false
				});
			});
    }

    render() {
        return (
			<LoadingOverlay 
				className="RegisterLogin" 
				active={this.state.isLoading} 
				spinner
			>
				<span className="title">REGISTER</span>
				{this.state.errorReason && 
					(<div className="message error">
						<span>{this.state.errorReason}</span>
					</div>)
				}
				<Formsy className="form" onValidSubmit={this.handleSubmit}>
					<div>
						<FormsyInput
							name="username"
							placeholder="Username"
							validations="isExisty"
							validationError="Username should be provided"
							required
						/>
					</div>
					<div>
						<FormsyInput
							name="email"
							placeholder="Email"
							validations="isEmail"
							validationError="Provide a valid email."
							required
						/>
					</div>
					<div>
						<FormsyInput
							name="password"
							placeholder="Password"
							type="password"
							validations="isExisty"
							validationError="Provide a valid password."
							// validationErrors={{
							// 	isDefaultRequiredValue: "Provide a valid password."
							// }}
							required
						/>
					</div>
					<div>
						<button type="submit" className="submit">SUBMIT</button>
					</div>
					<div className="Redirect">
						<span>Already a member? </span>
						<Link to="/login">Login</Link>
					</div>
				</Formsy>
			</LoadingOverlay>
        )
    }
}