import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
// import "./Main.css";

export default class Ads extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            ads: [],
        };
	}
	
	componentDidMount() {
		const { match } = this.props;
		const id = match.params.id;

		let url = "/api/ads";

		if (id) {
			url += "/" + id;
		}

		fetch(url)
			.then((response) => response.json())
			.then(data => {
				if (!Array.isArray(data)) {
					data = [data];
				}
				this.setState( { ads: data})
			});
	}

    render() {
		let { ads } = this.state;

        return ( 
            <div className="Ads">
                  <ul>
					{ads.map(ad =>
					<li>
						<span>{ad.title}</span>
						<span>{ad.content}</span>
					</li>
				)}
				</ul>
            </div>
        );
    }
}
