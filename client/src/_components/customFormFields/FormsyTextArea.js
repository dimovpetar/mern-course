import { withFormsy } from "formsy-react";
import React from "react";
import "./FormsyElements.scss";
import { throws } from "assert";

class FormsyTextArea extends React.Component {
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
			<textarea
				onChange={this.changeValue}
				name={this.props.name}
				type={this.props.type}
				placeholder={this.props.placeholder}
				value={this.props.getValue()}
				disabled={this.props.disabled}
			/>
			<span className="errorMessage" style={{ display: errorMessage ? "block" : "none"}}>{errorMessage}</span>
		</div>
    );
  }
}

export default withFormsy(FormsyTextArea);