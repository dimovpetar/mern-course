import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./FilterBar.scss";
import FilterBarItem from "./FilterBarItem";
import Dropdown from "../_components/Dropdown";
import Button from "../_components/Button";
import { pickFromObject } from "../_utils/object";
import { categories } from "../_constants/categories.json"

class FilterBar extends Component {

    constructor(props) {
		super(props);
		
		this.state = {
			filterParams: {
				keyword: "",
				category: "",
				priceFrom: "",
				priceTo: "",
				location: ""
			},
			selectedFilterTitle: null,
			selectedFilterIcon: null,
			categories: categories
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFilterItemClick = this.handleFilterItemClick.bind(this);
		this.changeSelectedCategory = this.changeSelectedCategory.bind(this);
	}

	componentDidMount() {

		// turn the url query params to an object
		const urlQueryParams =  new URLSearchParams(this.props.history.location.search);
		const params = Object.fromEntries(urlQueryParams);

		// take only what we need from the query string
		const filterParams = pickFromObject(params, ["keyword",	"category",	"priceFrom", "priceTo",	"location"]);

		this.setState({
			filterParams: {
				...this.state.filterParams,
				...filterParams
			}
		});
	}

	/**
	 * A generic handler for change on any input.
	 * The input should have a name set.
	 */
	handleInputChange(event) {
		const { name, value }= event.target;

		this.setState({ 
			filterParams : {
				...this.state.filterParams,
				[ name ]: value
			}
		});	
	}
	
	handleSubmit (event) {
		event.preventDefault();
		const searchParams = {};
		
		// build search params only with the provided ones
		for (let [key, value] of Object.entries(this.state.filterParams)) {
			if (value) {
				searchParams[key] = value;
			}
		}

		this.props.history.push({
			pathname: '/search',
			search: "?" + new URLSearchParams(searchParams).toString()
		});

		this.props.history.replace('/search?' +  new URLSearchParams(searchParams).toString())
	}

	handleFilterItemClick(event, filterItemTitle, filterItemIcon) {

		let newFilterTitle = filterItemTitle;

		// if the pressed item is the same as the current one deselect it
		if (filterItemTitle === this.state.selectedFilterTitle) {
			newFilterTitle = null;
		}

		this.setState({ 
			filterParams: {
				...this.state.filterParams,
				category: newFilterTitle
			},
			selectedFilterTitle: newFilterTitle ,
			selectedFilterIcon: filterItemIcon
		});
	}

	changeSelectedCategory(event, key) {
		this.setState({
			filterParams: {
				...this.state.filterParams,
				category: key
			}
		});
	}

    render() {
		const { location } = this.props;
		const showAdditionalFilters = location.pathname.match(/search/);

		// hide filterbar when not on home or search page
		if (location.pathname !== "/" && !location.pathname.match(/search/)) {
			return null;
		}
 
        return ( 

            <div className="FilterBar">
				<form onSubmit={this.handleSubmit}>
					<div className="col1">
						<input 
							className="searchInput" 
							type="search"
							placeholder="Enter search keyword"
							value={this.state.filterParams.keyword}
							name="keyword"
							onChange={this.handleInputChange}
						/>
						{showAdditionalFilters &&	
							<Dropdown 
								className="categoryDropdown"
								list={this.state.categories}
								onSelectionChange={this.changeSelectedCategory}
								selectedKey={this.state.filterParams.category}
							/>
						}
					</div>
					<Button className="searchButton" type="submit"/>
				</form>
				{!showAdditionalFilters ? 
					(<div className="gridContainer">
						{this.state.categories.map((item) => 
							<FilterBarItem 
								key={item.key} 
								selectedTitle={this.state.selectedFilterTitle} 
								title={item.title} 
								icon={item.icon}
								onClick={this.handleFilterItemClick}
							/>
						)}
					</div>)
					:
					(<div className="additionalFilters">
						<div className="column">
							<span>Price from (eur):</span>
							<input 
								className="tinyMarginTop" 
								value={this.state.filterParams.priceFrom}
								name="priceFrom"
								onChange={this.handleInputChange}
								type="number"
							/>
						</div>
						<div className="column">
							<span>Price to (eur):</span>
							<input 
								className="tinyMarginTop"
								value={this.state.filterParams.priceTo}
								name="priceTo"
								onChange={this.handleInputChange}
								type="number"
							/>
						</div>
						<div className="column">
							<span>Location:</span>
							<input 
								className="tinyMarginTop"
								value={this.state.filterParams.location}
								name="location"
								onChange={this.handleInputChange}
							/>
						</div>
					</div>)
				}
            </div>
        );
    }
}

export default withRouter(FilterBar);
