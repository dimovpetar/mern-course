import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import './Auth.scss';
import { authenticationService } from '../_services/authentication.service';
import Formsy from "formsy-react";
import FormsyInput from '../_components/customFormFields/FormsyInput';
import LoadingOverlay from 'react-loading-overlay';

export default class Login extends Component {
    constructor(props) {
		super(props);

		// redirect to home if already logged in
		if (authenticationService.isLoggedIn()) { 
			this.props.history.push('/');
		}

        this.state = {
			message: "", // if the user comes from successful registration, this will be set
			errorReason: "",
			isLoading: false	
		};
		
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const locationState = this.props.location.state;

        if (locationState && locationState.message) {
            this.setState({
                message: locationState.message
            });
            delete locationState.message;
            this.props.history.replace({ state: locationState });
        }

    }

    handleSubmit(data) {
		this.setState({
			isLoading: true
		});

		authenticationService.login(data)
			.then(({ data }) => {
				debugger
				// redirect the user to the home page
				this.props.history.push("/");
			})
			.catch((error) => {	
				debugger
				this.setState({
					errorReason: error.response.data,
					isLoading: false
				});
			});
    }

    render() {
		const { message, errorReason } = this.state;

        return (
			<LoadingOverlay 
				className="RegisterLogin" 
				active={this.state.isLoading} 
				spinner
			>
				<span className="title">LOGIN</span>
				{(message || errorReason) && 
					(<div className={`message ${errorReason ? "error": "success"}`}>
						<span>
							{errorReason ? errorReason : "Registration successful!"}
						</span>
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
							name="password"
							placeholder="Password"
							validations="isExisty"
							validationError="Please provide a password"
							type="password"
							required
						/>
                    </div>
                    <div>
						<button type="submit" className="submit">SUBMIT</button>
                    </div>
                    <div className="Redirect">
                        <span>Not registered? </span>
                        <Link to="/register">Sign up now</Link>
                    </div>
                </Formsy>
			</LoadingOverlay>
        )
    }
}