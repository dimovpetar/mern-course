import React, { Component } from "react";
import "./AdDetailedView.scss";
import { adService } from "../_services/ad.service";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MessageForm from "./MessageForm";
import moment from "moment";

class AdDetailedView extends Component {

    constructor(props) {
		super(props);
		
		this.state = {
			ad: null,
			errorMessage: ""
		}
	}

	componentDidMount() {
		const { match: { params } } = this.props;

		adService.getAd(params.id)
			.then(({ data }) => {
				data.createdAt = moment(data.createdAt).format('Do MMMM YYYY');
				this.setState({ ad: data });
			})
			.catch(err => {
				this.setState({ errorMessage: err.response.statusText });
			});
	}
	
    render() {
        return (
            <div className="AdDetailedView">
				{!this.state.ad && this.state.errorMessage &&
					<div className="errorMessage">
						{this.state.errorMessage}
					</div>
				}
				{this.state.ad &&
					<div className="wrapper">
						<section className="content">
							<h1 className="title">{this.state.ad.title}</h1>
							<div className="adPictures">
								<Carousel 
									infiniteLoop={true} 
									width="100%" 
									useKeyboardArrows={true}
									dynamicHeight
								>
									{this.state.ad.images.map(imageSrc => (
										<div key={imageSrc}>
											<img src={`/images/ads/${imageSrc}`} alt="preview"/>
										</div>
									))}
								</Carousel>
							</div>
							<div className="adDetails">
								<span className="label">Category: </span>
								<span className="smallMarginEnd">{this.state.ad.category}</span>
								<span className="label">Published on: </span>
								<span>{this.state.ad.createdAt}</span>
							</div>
							<pre className="adDecription">{this.state.ad.description}</pre>
						</section>
						<section className="contactDetails">
							<div className="adPrice">
								<div className="priceWrapper">
									<span className="priceLabel">Price: </span>
									<span className="price">{this.state.ad.price}€</span>
								</div>
							</div>
							{this.state.ad.telephone && 
								<div className="phone">
									<i className="fas fa-phone" /> 
									<span>{this.state.ad.telephone}</span>
								</div>
							}
							<div className="adOwner">
								<span className="ownerLabel">Owner: </span>
								<span className="ownerName">{this.state.ad.createdBy}</span>
							</div>
							<div>
								<MessageForm adOwnerId={this.state.ad.createdById} adId={this.state.ad.id}/>
							</div>
						</section>
					</div>	
				}
            </div>
        );
    }
}

export default AdDetailedView;
