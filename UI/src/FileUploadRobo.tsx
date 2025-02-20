import axios from "axios";
import React, { useState } from "react";
import { AnalysisResponse } from "./models";

function FileUploadRobo() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [annotatedImage, setAnnotatedImage] = useState(null);

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

    const reader = new FileReader();

    // Convert the image to base64 once it is loaded
    reader.onloadend = () => {
      setBase64Image(reader.result); // Store the base64 string in the state
    };

    reader.readAsDataURL(image); // Read the image file as a base64 string

    axios({
      method: "POST",
      url: "https://detect.roboflow.com/dirty-detect/8",
      params: {
        api_key: "NmU5v5iwNxZ9lgYVsGAB",
      },
      data: base64Image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(function (response) {
        //console.log(response.data);

        const jsonString = JSON.stringify(response.data, null, 2);
        setResponse(jsonString);

        const analysis = response.data as AnalysisResponse;

        const imageUrl = URL.createObjectURL(image);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          const annotatedImage = drawAnnotations(img, analysis.predictions);
          setAnnotatedImage(annotatedImage); // Set the annotated image to state
        };
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  // Function to draw annotations on the image
  const drawAnnotations = (image, predictions) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    predictions.forEach((prediction) => {
      const { x, y, width, height, class: label } = prediction;

      // Calculate the top-left corner of the bounding box
      const startX = x - width / 2;
      const startY = y - height / 2;

      // Draw the bounding box
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(startX, startY, width, height);
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Spillage", startX, startY > 10 ? startY - 5 : 10);
    });

    return canvas.toDataURL(); // Return the annotated image as base64
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={!image}>
        Upload
      </button>
      <textarea
        value={response}
        readOnly
        rows={20}
        cols={50}
        style={{ marginTop: "10px", width: "100%" }}
      />
      {annotatedImage ? (
        <img src={annotatedImage} alt="Annotated" />
      ) : (
        <p>Loading annotated image...</p>
      )}
    </div>
  );
}

export default FileUploadRobo;
