import React, { Component } from "react";
import AdPreview from "./ads/AdPreview";
import "./SearchResults.scss";
import { adService } from "./_services/ad.service";

class SearchResults extends Component {

    constructor(props) {
		super(props);

		this.state = {
			results: []
		}

		this.getResults = this.getResults.bind(this);
	}

	componentDidMount() {
		this.getResults();
	}

	componentDidUpdate(prevProps) {	
		// detect change in the query string
		if (this.props.location.search !== prevProps.location.search) {
			this.getResults();
		}
	}

	getResults() {

		const searchParams = new URLSearchParams(this.props.location.search);

		adService.find(searchParams)
			.then(({ data }) => {
				this.setState({ results: data });
			})
			.catch(err => {

			});
	}

    render() {
        return ( 
            <div className="SearchResults">
				<h2>Search results for {this.state.searchKeyword}</h2>
				<div className="gridContainer">
					{this.state.results.map((ad) => {
						return <AdPreview key={ad.id} {...ad}></AdPreview>
					})}
				</div>
            </div>
        );
    }
}

export default SearchResults;
