import React, { Component } from "react";
import "./Ads.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import { adService } from "../_services/ad.service";

class Ads extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ads: []
		};

		this.archiveAd = this.archiveAd.bind(this);
		this.deleteAd = this.deleteAd.bind(this);
	}

	componentDidMount() {
		adService.getOwnAds()
			.then(({ data }) => {

				// format createdAt date to a readable string
				data.map(el =>  el.createdAt = moment(el.createdAt).format('Do MMMM YYYY'));
				this.setState({ ads: data });
			})
			.catch(err => {

			});
	}

	/**
	 * 
	 * @param {string} adId The id of the ad to archive / unarchive.
	 * @param {boolean} archive Whether to archive or unarchive the ad.
	 */
	archiveAd(adId, archive) {
		adService.set(adId, { archive: archive })
			.then(() => {
				const ads = [...this.state.ads];
				const index = ads.findIndex((el) => el.id === adId);
				const updatedAd = {
					...ads[index],
					archived: archive
				};
				
				ads[index] = updatedAd;

				this.setState({ ads: ads });
			});
	}

	deleteAd(adId) {
		adService._delete(adId)
			.then(() => {
				const ads = [...this.state.ads];
				const index = ads.findIndex((el) => el.id === adId);
			
				ads.splice(index, 1);

				this.setState({ ads: ads });
			});
	}

	render() {
		const { match, location: { pathname } } = this.props; 
		const showArchived = pathname.endsWith("archived");
		const ads = this.state.ads.filter(ad => ad.archived === showArchived);

		return (
			<div className="Ads">
				<h2 className="header">Ads</h2>
				<div className="tabs">	
					<Link to={`${match.url}/active`} className={`${!showArchived && "active"}`}>Active</Link>
					<span>|</span>
					<Link to={`${match.url}/archived`} className={`${showArchived && "active"}`}>Archived</Link>
				</div>
				<div>
				<table className="content">
					<colgroup>
						<col width="15%"/>
						<col width="25%"/>
						<col width="20%"/>
						<col width="20%"/>
						<col width="20%"/>
					</colgroup>
					<thead>
						<tr>
							<th>
								<span>Date</span>
							</th>
							<th>
								<span>Photo</span>
							</th>
							<th>
								<span>Title</span>
							</th>
							<th>
								<span>Price</span>
							</th>
							<th>
								
							</th>
						</tr>
					</thead>
					<tbody>
						{ads
							.map((ad, index) => {

							return (
								<tr key={index}>
									<td>{ad.createdAt}</td>
									<td>
										<img src={`/images/ads/${ad.img}`} alt={ad.title}/>
									</td>
									<td>{ad.title}</td>
									<td>{ad.price}</td>
									<td>
										<div className="buttonsWrapper">
											<Link to={`/ad/${ad.id}`}>
												<button>View</button>
											</Link>
											<Link to={`/create/${ad.id}`}>
												<button>Edit</button>
											</Link>
											{showArchived ?
												<>
													<button onClick={() => this.archiveAd(ad.id, false)}>
														Restore
													</button>
													<button onClick={() => this.deleteAd(ad.id)}>
														Delete
													</button>
												</> 
												:
												<button onClick={() => this.archiveAd(ad.id, true)}>
													Archive
												</button>
											}
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				</div>
			</div>
		);
	}
}

export default Ads;