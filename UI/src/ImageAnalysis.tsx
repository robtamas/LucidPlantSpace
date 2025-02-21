import React, { useState } from "react";
import { Analysis, Details } from "./models";
import axios from "axios";
import { addHours, format } from "date-fns";
import * as exifr from "exifr";

function ImageAnalysis() {
  const [image, setImage] = useState(null);
  const [responseImage, setResponseImage] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState<Details[]>();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      getLatLongFromImage(file);
    }
  };

  const getLatLongFromImage = (file: File) => {
    if (file) {
      exifr
        .parse(file, [
          "GPSLatitude",
          "GPSLongitude",
          "GPSLatitudeRef",
          "GPSLongitudeRef",
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
        .catch((error) => console.error("Error reading HEIC metadata:", error));
    }
  };

  const convertDMSToDD = (dmsArray: number[], direction: string): number => {
    const degrees = dmsArray[0];
    const minutes = dmsArray[1] / 60;
    const seconds = dmsArray[2] / 3600;
    let decimal = degrees + minutes + seconds;

    if (direction === "S" || direction === "W") {
      decimal *= -1;
    }

    return decimal;
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
              <li>
                Date:{" "}
                {format(
                  addHours(new Date(detail.date), 11),
                  "dd/MM/yyyy HH:mm:ss"
                )}
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
      )}
    </div>
  );
}

export default ImageAnalysis;
