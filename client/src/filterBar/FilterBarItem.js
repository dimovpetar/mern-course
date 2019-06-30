import React, { Component } from "react";
import "./FilterBarItem.scss";

class FilterBarItem extends Component {
	constructor (props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick (event) {
		// call passed click handler with additional parameter
		this.props.onClick(event, this.props.title.toLowerCase(), this.props.icon);
	}

    render() {

        return ( 
			<div className={ 
					"FilterBarItem " + 
					(this.props.selectedTitle === this.props.title.toLowerCase()  ? "selected" : "")
				} onClick={this.handleClick}>
				<i className={"fas fa-" + (this.props.icon || "search")}/>
				<span>{this.props.title}</span>
            </div>
        );
    }
}

export default FilterBarItem;
