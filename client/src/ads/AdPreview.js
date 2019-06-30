import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./AdPreview.scss";

class AdPreview extends Component {
    render() {
        return (
            <div className="AdPreview">
				<Link className="navContainer" to={`/ad/${this.props.id}`}>
					<div className="imgContainer">
						{/* <span className="helper"></span> */}
						<img src={`/images/ads/${this.props.img}`} alt="img"/>
					</div>
					<div className="adDescription">
						<span className="adTitle" href="ad">{this.props.title} </span>
						<span>Price: {this.props.price}</span>
					</div>
				</Link>
            </div>
        );
    }
}

export default AdPreview;
