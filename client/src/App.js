import React, { Component } from 'react';
import './App.scss';
import Login from "./auth/Login";
import Register from "./auth/Register";
import Main from "./Main";
import { Switch, Route } from 'react-router-dom';

class App extends Component {
	render() {	
		return (
			<div className="App">
				<Switch>
					<Route path='/login' component={Login}/>
					<Route path='/register' component={Register}/>
					<Route component={Main}/>
				</Switch>
			</div>
		);
	}
}

export default App;
