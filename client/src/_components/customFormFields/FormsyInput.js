import { withFormsy } from "formsy-react";
import React from "react";
import "./FormsyElements.scss";

class FormsyInput extends React.Component {
	constructor(props) {
		super(props);
		this.changeValue = this.changeValue.bind(this);
	}

	changeValue(event) {
		// setValue() will set the value of the component, which in
		// turn will validate it and the rest of the form
		// Important: Don't skip this step. This pattern is required
		// for Formsy to work.
		this.props.setValue(event.currentTarget.value);
	}

	render() {
		// An error message is returned only if the component is invalid
		const errorMessage = this.props.getErrorMessage();

		return (
			<div className="FormsyElement">
				<input
					onChange={this.changeValue}
					name={this.props.name}
					placeholder={this.props.placeholder}
					type={this.props.type}
					value={this.props.getValue() || ""}
				/>
				<span className="errorMessage" style={{ display: errorMessage ? "block" : "none"}}>{errorMessage}</span>
			</div>
		);
	}
}

export default withFormsy(FormsyInput);