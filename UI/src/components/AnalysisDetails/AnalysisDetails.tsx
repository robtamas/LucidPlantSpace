import { addHours, format } from "date-fns";
import { Details, IdeagenAssuranceRequest } from "../../models";
import axios from "axios";

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
      name: "Slip Hazard Detection",
      fields: analysisDetails.map((detail) => ({
        "Hazard Type": "Slip Hazard",
        Location: `${latitude}, ${longitude}`,
        "Recommended Actions": detail.action.steps.join(", "),
        Description: detail.action.title,
      })),
    };

    // send to Ideagen Assurance
    axios({
      method: "POST",
      url: "https://3uc2hrbzfb.execute-api.ap-southeast-2.amazonaws.com/Prod/risks",
      data: request,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "nUtw2g68wU2yi3JSGdhIkalFS95HKJIZ2Z8Lns4k",
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
    <div style={{ color: "black" }}>
      <h3>Hazard Analysis</h3>
      {analysisDetails.map((detail, idx) => (
        <ul key={idx} style={{ listStyleType: "none" }}>
          <li>Hazard Type: {detail.type}</li>
          <li>Confidence: {Number((detail.confidence * 100).toFixed(2))}%</li>
          <li>
            Date:{" "}
            {format(addHours(new Date(detail.date), 11), "dd/MM/yyyy HH:mm:ss")}
          </li>
          {latitude && longitude && (
            <>
              <li>Latitude: {latitude}</li>
              <li>Longitude: {longitude}</li>
            </>
          )}
          <li>
            Action Required: {detail.action.title}
            <div>
              <div style={{ marginTop: "10px" }}>
                {detail.action.description}
              </div>
              <ol>
                {detail.action.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </li>
          <li>
            <div style={{ marginTop: "10px", display: "flex" }}>
              <span>Export Options:</span>
              <button onClick={sendToIdeagenAssurance}>
                Ideagen Assurance
              </button>
              <button>Create PDF</button>
              <button>Email</button>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default AnalysisDetails;
