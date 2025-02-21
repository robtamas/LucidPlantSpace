import { useState } from 'react';
import { Analysis, Details } from './models';
import axios from 'axios';
import * as exifr from 'exifr';
import AnalysisDetails from './components/AnalysisDetails/AnalysisDetails';
import welcomeImage from './assets/images/slip-haz-sign-pink2.png';

export const buttonStyle = {
	WebkitBoxAlign: 'center',
	alignItems: 'center',
	border: 'none',
	display: 'flex',
	WebkitBoxPack: 'center',
	justifyContent: 'center',
	backgroundColor: 'rgb(27, 131, 139)',
	color: 'rgb(255, 255, 255)',
	borderRadius: '0.375rem',
	// padding: '0.375rem 0.5rem',
	width: 'fit-content',
	// height: 'fit-content',
	fontFamily: 'Gilroy, Verdana, sans-serif',
	fontSize: '1.2rem',
	fontWeight: 700,
	lineHeight: '1.5rem',
	padding: '12px 32px',
	// maxHeight: '40px',
	cursor: 'pointer',
};

function ImageAnalysis() {
	const [image, setImage] = useState(null);
	const [displayImage, setDisplayImage] = useState<string | undefined>(
		undefined
	);
	// const [preResponse, setPreResponse] = useState(null);
	const [responseImage, setResponseImage] = useState('');
	const [analysisDetails, setAnalysisDetails] = useState<
		Details[] | undefined
	>();
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);
			getLatLongFromImage(file);
			setDisplayImage(URL.createObjectURL(file));
		}
	};

	const getLatLongFromImage = (file: File) => {
		if (file) {
			exifr
				.parse(file, [
					'GPSLatitude',
					'GPSLongitude',
					'GPSLatitudeRef',
					'GPSLongitudeRef',
				])
				.then((metadata) => {
					if (metadata?.GPSLatitude && metadata?.GPSLongitude) {
						setLatitude(
							convertDMSToDD(metadata.GPSLatitude, metadata.GPSLatitudeRef)
						);
						setLongitude(
							convertDMSToDD(metadata.GPSLongitude, metadata.GPSLongitudeRef)
						);
					}
				})
				.catch((error) => console.error('Error reading HEIC metadata:', error));
		}
	};

	const convertDMSToDD = (dmsArray: number[], direction: string): number => {
		const degrees = dmsArray[0];
		const minutes = dmsArray[1] / 60;
		const seconds = dmsArray[2] / 3600;
		let decimal = degrees + minutes + seconds;

		if (direction === 'S' || direction === 'W') {
			decimal *= -1;
		}

		return decimal;
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
				// minHeight: '100vh',
				/* max-height: 100vh; */
				/* overflow: hidden; */
				// margin: '0 auto',
				margin: '0 auto',
				padding: '0',
				/* text-align: center; */
			}}
		>
			<div
				style={{
					height: '64px',
					width: '100%',
					background: '#056D78',
					position: 'fixed',
					left: 0,
					right: 0,
				}}
			>
				<h1
					style={{
						color: 'white',
						textAlign: 'center',
						fontSize: '20px',
						lineHeight: '40px',
					}}
				>
					Hazards
				</h1>
			</div>

			{/* main body */}
			<div
				style={{
					flex: '1 1 auto',
					width: '100%',
					background: 'white',
					overflowX: 'auto',
				}}
			>
				{/* content */}
				<div
					style={{
						color: '#2F4051',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						paddingTop: '64px',
					}}
				>
					{!displayImage && !responseImage && (
						<div style={{ padding: '8px 24px', textAlign: 'center' }}>
							<img
								src={welcomeImage}
								alt="detect hazard"
								width="150px"
								style={{ margin: '42px auto 12px' }}
							/>
							<p
								style={{
									fontSize: '28px',
									color: '#056D78',
									fontWeight: 'bold',
									margin: '18px 0 0',
									lineHeight: '1.2',
								}}
							>
								Report hazards
								<br />
								quickly & easily
							</p>
							<p
								style={{
									fontSize: '20px',
									color: '#2F4051',
									margin: '24px 0 0',
									lineHeight: '1.2',
								}}
							>
								Capture critical information
								<br />
								about hazards
							</p>
						</div>
					)}

					<div
						style={{
							color: '#2F4051',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							paddingTop: '12px',
						}}
					>
						{image && !responseImage && (
							<img
								src={displayImage}
								style={{
									maxWidth: '90vw',
									// maxHeight: '100vw',
								}}
							/>
						)}
					</div>

					{responseImage && (
						<div>
							<img
								src={responseImage}
								alt="response"
								style={{
									maxWidth: '90vw',
									// maxHeight: '80vw',
								}}
							/>
						</div>
					)}
				</div>

				{analysisDetails && analysisDetails.length > 0 && responseImage && (
					<div style={{ padding: '0 24px' }}>
						<AnalysisDetails
							analysisDetails={analysisDetails}
							latitude={latitude}
							longitude={longitude}
						/>
					</div>
				)}
				{analysisDetails && analysisDetails.length === 0 && responseImage && (
					<p
						style={{
							fontSize: '32px',
							color: '#056D78',
							fontWeight: 'bold',
							margin: '18px 0 0',
							lineHeight: '1.2',
							textAlign: 'center',
							paddingTop: '12px',
						}}
					>
						No Hazards Detected
					</p>
				)}
			</div>

			{/* footer */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100px',
					width: '100%',
					// background: '#DDE0E3',
					color: '#2F4051',
				}}
			>
				{!displayImage && !responseImage && (
					<>
						<label htmlFor="file-upload" style={buttonStyle}>
							Take Photo
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
				{displayImage && !responseImage && (
					<button onClick={handleUpload} disabled={!image} style={buttonStyle}>
						Report Hazard
					</button>
				)}
			</div>
		</div>
	);
}

export default ImageAnalysis;
