import { useState } from 'react';
import { Analysis, Details } from './models';
import axios from 'axios';
import cameraIcon from './assets/images/camera-solid-white.svg';

function ImageAnalysis() {
	const [image, setImage] = useState(null);
	const [displayImage, setDisplayImage] = useState<string | undefined>(
		undefined
	);
	// const [preResponse, setPreResponse] = useState(null);
	const [responseImage, setResponseImage] = useState('');
	const [analysisDetails, setAnalysisDetails] = useState<Details[]>();

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);
			setDisplayImage(URL.createObjectURL(file));
		}
	};

	const handleUpload = () => {
		if (!image) return;

		const formData = new FormData();
		formData.append('file', image);

		axios({
			method: 'POST',
			url: '/api/detect/',
			data: formData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then(function (response) {
				const analysis = response.data as Analysis;
				const base64Image = `data:image/png;base64,${analysis.image}`;

				setResponseImage(base64Image);
				setAnalysisDetails(analysis.details);
			})
			.catch(function (error) {
				console.log(error.message);
			});
	};

	return (
		// header
		<div
			style={{
				background: 'white',
				display: 'flex',
				justifyContent: 'flex-start',
				alignItems: 'center',
				flexDirection: 'column',
				/* max-width: 1280px; */
				width: '100%',
				minHeight: '100vh',
				/* max-height: 100vh; */
				/* overflow: hidden; */
				// margin: '0 auto',
				margin: '0 auto',
				padding: 0,
				/* text-align: center; */
			}}
		>
			<div
				style={{
					height: '64px',
					width: '100%',
					background: '#056D78',
				}}
			>
				<h1
					style={{
						color: 'white',
						textAlign: 'center',
						fontSize: '30px',
						lineHeight: 1,
					}}
				>
					M.A.D.H.A.T.
				</h1>
			</div>

			{/* main body */}
			<div
				style={{
					flex: '1 1 auto',
					width: '100%',
					background: 'white',
				}}
			>
				{/* content */}
				{image && (
					<img
						src={displayImage}
						style={{
							maxWidth: '80vw',
							maxHeight: '80vw',
						}}
					/>
				)}

				<button onClick={handleUpload} disabled={!image}>
					Use Photo
				</button>

				{responseImage && (
					<div>
						<img
							src={responseImage}
							alt="response"
							style={{
								maxWidth: '80vw',
								maxHeight: '80vw',
							}}
						/>
					</div>
				)}

				{analysisDetails && (
					<div>
						<h2>Details</h2>
						{analysisDetails.map((detail) => (
							<ul>
								<li>Type: {detail.type}</li>
								<li>
									Confidence: {Number((detail.confidence * 100).toFixed(2))}%
								</li>
								<li>Date: {detail.date}</li>
								<li>Action: {detail.action}</li>
							</ul>
						))}
					</div>
				)}
			</div>

			{/* footer */}
			<div
				style={{
					height: '64px',
					width: '100%',
					background: '#DDE0E3',
					color: '#2F4051',
				}}
			>
				{!responseImage && (
					<>
						<label
							htmlFor="file-upload"
							style={{
								WebkitBoxAlign: 'center',
								alignItems: 'center',
								border: 'none',
								display: 'flex',
								WebkitBoxPack: 'center',
								justifyContent: 'center',
								backgroundColor: 'rgb(27, 131, 139)',
								color: 'rgb(255, 255, 255)',
								borderRadius: '0.375rem',
								padding: '0.375rem 0.5rem',
								width: 'fit-content',
								height: 'fit-content',
								fontFamily: 'Gilroy, Verdana, sans-serif',
								fontSize: '1rem',
								fontWeight: 700,
								lineHeight: '1.25rem',
							}}
						>
							<img
								src={cameraIcon}
								alt="Add Image"
								width="24px"
								style={{
									marginRight: '8px',
									fill: 'white',
								}}
							/>
							Add Photo
						</label>
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: 'none' }}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default ImageAnalysis;
