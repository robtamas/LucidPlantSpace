import { addHours, format } from 'date-fns';
import { Details, IdeagenAssuranceRequest } from '../../models';
import axios from 'axios';
import { buttonStyle } from '../../ImageAnalysis';

type AnalysisDetailsProps = {
	analysisDetails: Details[];
	latitude: string | null;
	longitude: string | null;
};

const AnalysisDetails = ({
	analysisDetails,
	latitude,
	longitude,
}: AnalysisDetailsProps) => {
	const sendToIdeagenAssurance = () => {
		const request: IdeagenAssuranceRequest = {
			name: 'Slip Hazard Detection',
			fields: analysisDetails.map((detail) => ({
				'Hazard Type': 'Slip Hazard',
				Location: `${latitude}, ${longitude}`,
				'Recommended Actions': detail.action.steps.join(', '),
				Description: detail.action.title,
			})),
		};

		// send to Ideagen Assurance
		axios({
			method: 'POST',
			url: 'https://3uc2hrbzfb.execute-api.ap-southeast-2.amazonaws.com/Prod/risks',
			data: request,
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': 'nUtw2g68wU2yi3JSGdhIkalFS95HKJIZ2Z8Lns4k',
			},
		})
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error.message);
			});
	};

	return (
		<div style={{ color: 'black' }}>
			<p
				style={{
					fontSize: '24px',
					color: '#056D78',
					fontWeight: 'bold',
					margin: '0px 0 0',
					lineHeight: '1.2',
					// textAlign: 'center',
					paddingTop: '12px',
				}}
			>
				Hazard Analysis
			</p>
			{analysisDetails.map((detail, idx) => (
				<ul
					key={idx}
					style={{
						listStyleType: 'none',
						padding: '0 0 0 8px',
						marginTop: '8px',
					}}
				>
					<li>
						<b style={{ marginRight: '8px' }}>Hazard Type:</b>
						{detail.type}
					</li>
					<li>
						<b style={{ marginRight: '8px' }}>Confidence:</b>
						{Number((detail.confidence * 100).toFixed(2))}%
					</li>
					<li>
						<b style={{ marginRight: '8px' }}>Date:</b>
						{format(addHours(new Date(detail.date), 11), 'dd/MM/yyyy HH:mm:ss')}
					</li>
					{latitude && longitude && (
						<>
							<li>
								<b style={{ marginRight: '8px' }}>Latitude:</b>
								{latitude}
							</li>
							<li>
								<b style={{ marginRight: '8px' }}>Longitude:</b>
								{longitude}
							</li>
						</>
					)}
					<li>
						<b style={{ marginRight: '8px' }}>Action Required:</b>
						{detail.action.title}

						<div
							style={{
								fontSize: '18px',
								color: '#056D78',
								fontWeight: 'bold',
								margin: '0px 0 0',
								lineHeight: '1.2',
								// textAlign: 'center',
								paddingTop: '12px',
							}}
						>
							{detail.action.description}
						</div>
						<ol>
							{detail.action.steps.map((step, idx) => (
								<li key={idx}>{step}</li>
							))}
						</ol>
					</li>
					<li>
						<p
							style={{
								fontSize: '24px',
								color: '#056D78',
								fontWeight: 'bold',
								margin: '0px 0 0',
								lineHeight: '1.2',
								// textAlign: 'center',
								paddingTop: '24px',
							}}
						>
							Export Options:
						</p>

						<div
							style={{
								marginTop: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								gap: '8px',
							}}
						>
							<button
								onClick={sendToIdeagenAssurance}
								style={{ ...buttonStyle, width: '100%' }}
							>
								Ideagen Assurance
							</button>
							<button style={{ ...buttonStyle, width: '100%' }}>
								Create PDF
							</button>
							<button style={{ ...buttonStyle, width: '100%' }}>Email</button>
						</div>
					</li>
				</ul>
			))}
		</div>
	);
};

export default AnalysisDetails;
