import React, { useState } from "react";
import { Analysis, Details } from "./models";
import axios from "axios";

function ImageAnalysis() {
  const [image, setImage] = useState(null);
  const [responseImage, setResponseImage] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState<Details[]>();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    axios({
      method: "POST",
      url: "/api/detect/",
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={!image}>
        Upload
      </button>
      {responseImage && (
        <div>
          <img src={responseImage} alt="response" />
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
  );
}

export default ImageAnalysis;
