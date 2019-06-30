import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authenticationService } from "../_services/authentication.service";

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
			authenticationService.isLoggedIn()
				? <Component {...props} />
				: <Redirect to="/login" />
		)} 
	/>
)

export { PrivateRoute };
