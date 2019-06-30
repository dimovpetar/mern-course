import React, { Component } from 'react';
import { adService } from "./_services/ad.service";
import AdPreview from './ads/AdPreview';
import "./Home.scss";

class Home extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			ads: []
		};
	}

    componentDidMount() {
		adService.getMostRecent()
			.then(({ data }) => {
				this.setState({
					ads: data
				});
			})
			.catch( err => {

			});
    }

    render() {
        return (

            <div className="Home">
				<div className="gridContainer">
					{this.state.ads.map(ad => {
						return <AdPreview key={ad.id} {...ad}></AdPreview>
					})}
				</div>
            </div>
        );
    }
}

export default Home;