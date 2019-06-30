import React, { Component } from "react";
import "./CreateAd.scss";
import ImageUploader from "react-images-upload";
import FlipMove from 'react-flip-move';
import LoadingOverlay from "react-loading-overlay";
import Formsy from "formsy-react";
import FormsyInput from "../_components/customFormFields/FormsyInput";
import FormsyTextArea from "../_components/customFormFields/FormsyTextArea";
import FormsyDropdown from "../_components/customFormFields/FormsyDropdown";
import { adService } from "../_services/ad.service";
import { categories } from "../_constants/categories.json"

const MB = 1024 * 1024;

class CreateAd extends Component {

    constructor(props) {
		super(props);

		this.state = {
			isEditting: false,
			edit: {
				previousImages: [], // old images that will be editted
				imagesToDelete: [],
				title: "",
				categoryKey: "",
				description: "",
				location: "",
				telephone: "",
				price: ""
			},
			images: [], // holder for new images that will be uploaded
			isValid: false,
			isUploading: false,
			errorMessage: "",
			categories: categories
		};

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.onImagesUpload = this.onImagesUpload.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
		this.create = this.create.bind(this);

	}

	disableButton() {
		this.setState({ isValid: false });
	}

	enableButton() {
		this.setState({ isValid: true });
	}

	componentDidMount() {
		const { match: { params }} = this.props;
		
		// if a specific ad is specified this means we are editting it
		if (params.id) {
			adService.edit(params.id)
				.then(({ data }) => {
					this.setState({
						isEditting: true,
						isValid: true,
						edit: {
							...this.state.edit,
							title: data.title,
							categoryKey: data.category,
							description: data.description,
							location: data.location,
							telephone: data.telephone,
							previousImages: data.images,
							price: data.price
						}
					});
				})
				.catch(err => {
					// handle unauthorized or 404
				});
		}
	}

	handleSubmit(formValues) {

		this.setState({
			isUploading: true
		});

		// combine uploaded files and other fileds into one FormData
		let formData = new FormData();

		for (let key in formValues) {
			formData.append(key, formValues[key]);
		}

		// add images that are about to be saved to the formData
		for (let i = 0; i < this.state.images.length; i++) {
			formData.append("images", this.state.images[i]);
		}

		if (this.state.isEditting) {
			this.saveChanges(formData);
		} else {
			this.create(formData);
		}
	}

	saveChanges(formData) {
		const { match: { params }} = this.props;

		this.setState({ isUploading: true });

		// add imagesToDelete to the formData
		for (let i = 0; i < this.state.edit.imagesToDelete.length; i++) {
			formData.append("imagesToDelete", this.state.edit.imagesToDelete[i]);
		}

		// add previousImages to the formData
		for (let i = 0; i < this.state.edit.previousImages.length; i++) {
			formData.append("previousImages", this.state.edit.previousImages[i]);
		}

		adService.update(params.id, formData)
			.then(({ data }) => {

			})
			.catch(err => {
				this.setState({
					errorMessage: err.response.data.errorMessage
				});
			})
			.finally(() => {
				this.setState({ isUploading: false });
			});
	}

	create(formData) {
		adService.create(formData)
			.then(response => {
				this.createAdForm.reset();
				// redirect the user to the home page
				this.props.history.push(`/ad/${response.data.id}`);
			}).catch(err => {
				this.setState({
					isUploading: false,
					errorMessage: err.response.data.errorMessage,
					isValid: false
				});
			});
	}

	/**
	 * 
	 * @param {Array} uploadedFiles Array of the currently uploaded files. Updates on every change, including deletions.
	 * @param {Array} uploadedFilesBase64 
	 */
	onImagesUpload(uploadedFiles, uploadedFilesBase64) {	
		this.setState({
			images: uploadedFiles
		});
	}

	/**
	 * When editting an old ad, this method takes care to store
	 * which of the old images is deleted
	 * 
	 * @param {*} image The name of the image which we will delete
	 * @param {*} index The index of the image
	 */
	onImageDelete(image, index) {

		const previousImagesCopy = [...this.state.edit.previousImages];
		previousImagesCopy.splice(index, 1); // remove the image from the array

		const newImagesToDelete = [...this.state.edit.imagesToDelete, image];

		this.setState({
			edit: {
				...this.state.edit,
				previousImages: previousImagesCopy,
				imagesToDelete: newImagesToDelete
			}
		});
	}

    render() {

        return ( 
			<LoadingOverlay active={this.state.isUploading} spinner>
				<Formsy 
					className="CreateAd" 
					onValidSubmit={this.handleSubmit} 
					onValid={this.enableButton} 
					onInvalid={this.disableButton}
					ref={(event) => { this.createAdForm = event; }}
				>
					<h1 className="header">Create advertisement</h1>
					<div className="errorMessage">{this.state.errorMessage}</div>
					<fieldset>
						<div className="title row">
							<label className="required">Title</label>
							<FormsyInput
								name="title"
								value={this.state.edit.title}
								placeholder="Title"
								validations="isExisty"
								validationError="Please enter a title"
								required
							/>
						</div>
						<div className="row">
							<label className="required">Category </label>
							<FormsyDropdown
								name="category"
								validations="isExisty"
								selectedKey={this.state.edit.categoryKey}
								placeholder="Select category"
								className="categoryDropdown"
								list={this.state.categories}
								required
							/>
						</div>
						<div className="row">
							<label className="required">Description</label>
							<FormsyTextArea 
								name="description"
								value={this.state.edit.description}
								type="text"
								placeholder="Description"
								required
							/>
						</div>
						<div className="row">
							<label className="required">Price</label>
							<FormsyInput
								name="price"
								value={this.state.edit.price}
								placeholder="Price (eur)"
								validations="isExisty"
								validationError="Please enter a price"
								required
							/>
						</div>
						<div className="row">
							<label>Images</label>
							<div className="imagesUploader">
								<ImageUploader
									withPreview={true}
									withIcon={true}
									buttonText="Choose images"
									onChange={this.onImagesUpload}
									imgExtension={[".jpg", ".jpeg", ".png"]}
									maxFileSize={MB}
									label="Max file size: 1mb, accepted: jpg, jpeg, png"
								/>
								{this.state.isEditting &&
									<FlipMove 
										enterAnimation="fade" 
										leaveAnimation="fade"
									>
										<div className="imagesPreview">
											{this.state.edit.previousImages.map((image, index) => {
												return (
													<div key={index} className="imageWrapper">
														<div className="deleteImage" onClick={() => this.onImageDelete(image, index)}>X</div>
														<img src={`/images/ads/${image}`} className="uploadPicture" alt="preview"/>
													</div>
													);
												})
											}
										</div>
									</FlipMove>
								}
							</div>
						</div>
						<div className="row">
							<label className="required">Location</label>
							<FormsyInput
								name="location"
								placehoder="Location"
								value={this.state.edit.location}
								type="text" 
								required
							/>
						</div>
						<div className="row">
							<label>Phone Number</label>
							<FormsyInput
								name="telephone"
								type="tel" 
								value={this.state.edit.telephone}
							/>
						</div>
						<div className="submit">
							<button className="submitButton" type="submit" disabled={!this.state.isValid}>
								{!this.state.isEditting ? "Submit" : "Save Changes"}
							</button> 
						</div>
					</fieldset>
				</Formsy>
			</LoadingOverlay>
        );
    }
}

export default CreateAd;
