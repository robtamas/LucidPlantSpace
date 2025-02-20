import React, { useState } from "react";
import { Analysis } from "./models";
import axios from "axios";

function ImageAnalysis() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");
  const [responseImage, setResponseImage] = useState("");

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

        const analysisDetails = JSON.stringify(analysis.details, null, 2);
        setResponse(analysisDetails);

        const base64Image = `data:image/png;base64,${analysis.image}`;
        setResponseImage(base64Image);
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
      <textarea
        value={response}
        readOnly
        rows={20}
        cols={50}
        style={{ marginTop: "10px", width: "100%" }}
      />
      {responseImage && <img src={responseImage} alt="response" />}
    </div>
  );
}

export default ImageAnalysis;
