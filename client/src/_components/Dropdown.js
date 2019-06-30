import React, { Component } from "react";
import "./Dropdown.scss";
import onClickOutside from "react-onclickoutside";

class Dropdown extends Component {

    constructor(props) {
		super(props);

        this.state = {
			listOpen: false,
			selectedKey: this.props.selectedKey
		};

		this.getItemByKey = this.getItemByKey.bind(this);
	}

	handleClickOutside() {
		this.setState({
			listOpen: false
		});
	}

	toggleList() {
		this.setState({
			listOpen: !this.state.listOpen
		});
	}

	// handler that is called when new item from the list is selected
	selectItem(event, key, title, icon){
		event.stopPropagation();

		this.setState({
			selectedKey: key,
			listOpen: false
		});

		// call listener for change
		if (this.props.onSelectionChange) {
			this.props.onSelectionChange(event, key);
		}
	}

	getItemByKey(key) {
		return this.props.list.find((item) => {
			return item.key === key;
		});
	}

	render() {
		const { list } = this.props;
		const { listOpen } = this.state;
		const selectedItem = this.getItemByKey(this.state.selectedKey || this.props.selectedKey);

		return (
			<div className={this.props.className + " Dropdown"}>
				<div className={`header ${!selectedItem ? "placeholder" : ""}`} onClick={() => this.toggleList()}>
					<div className="headerTitleWrapper">
						{selectedItem && <i className={`fas fa-${selectedItem.icon}`}/>}
						<div className="dd-header-title">{(selectedItem && selectedItem.title) || this.props.placeholder}</div>
					</div>
					{listOpen ?
						<i className="fas fa-angle-up" /> : 
						<i className="fas fa-angle-down" />
					}
				</div>
				{
					listOpen && 
					<ul className="list" onClick={e => e.stopPropagation()}>
						{list.map((item) => (
							<li className="listItem" 
								key={item.key}
								onClick={(event) => this.selectItem(event, item.key, item.title, item.icon)}>
									{item.icon && <i className={`fas fa-${item.icon}`}/>}
									<span>{item.title}</span>
							</li>
						))}
					</ul>
				}
			</div>
		)
	}
}

export default onClickOutside(Dropdown);