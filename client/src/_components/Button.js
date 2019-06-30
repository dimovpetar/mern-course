import React, { Component } from "react";
import "./Button.scss";


class Button extends Component {

	render() {
		const isWithIcon = true;

		return (
			<button 
				{...this.props}
				className={`Button ${isWithIcon && "buttonWithIcon"} ${this.props.className}`}
			>
				<i className="fa fa-search"/>
				Search
			</button>
		)
	}
}

export default Button;