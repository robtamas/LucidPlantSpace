import { addHours, format } from 'date-fns';
import { Details } from '../../models';

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
	return (
		<div style={{ color: 'black' }}>
			<h2>Details</h2>
			{analysisDetails.map((detail) => (
				<ul>
					<li>Type: {detail.type}</li>
					<li>Confidence: {Number((detail.confidence * 100).toFixed(2))}%</li>
					<li>
						Date:{' '}
						{format(addHours(new Date(detail.date), 11), 'dd/MM/yyyy HH:mm:ss')}
					</li>
					{latitude && longitude && (
						<>
							<li>Latitude: {latitude}</li>
							<li>Longitude: {longitude}</li>
						</>
					)}
					<li>
						Action Required: {detail.action.title}
						<p>
							<strong>{detail.action.description}</strong>
							<ul>
								{detail.action.steps.map((step) => (
									<li>{step}</li>
								))}
							</ul>
						</p>
					</li>
				</ul>
			))}
		</div>
	);
};

export default AnalysisDetails;
