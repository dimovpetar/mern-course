import { withFormsy } from "formsy-react";
import React from "react";
import Dropdown from "../../_components/Dropdown";
import "./FormsyElements.scss"

class FormDropdown extends React.Component {
	constructor(props) {
		super(props);

		this.changeValue = this.changeValue.bind(this);
	}

	componentWillReceiveProps(newProps) {

		// Formsy required value to be set.
		// In this case map selectedKey to value
		if (newProps.selectedKey !== this.props.selectedKey) {
			this.props.setValue(newProps.selectedKey);
		}
	}

	changeValue(event, key) {
		// setValue() will set the value of the component, which in
		// turn will validate it and the rest of the form
		// Important: Don't skip this step. This pattern is required
		// for Formsy to work.
		this.props.setValue(key);
	}

	render() {
		// An error message is returned only if the component is invalid
		const errorMessage = this.props.getErrorMessage();

		return (	
			<div className="FormsyElement">
				<Dropdown 
					className={this.props.className}
					onSelectionChange={this.changeValue}
					list={this.props.list}
					selectedKey={this.props.selectedKey}
					placeholder={this.props.placeholder}
				/>
				<span className="errorMessage" style={{ display: errorMessage ? "block" : "none" }}>{errorMessage}</span>
			</div>
		);
	}
}

export default withFormsy(FormDropdown);