import React, { useState } from "react";
import { Analysis } from "./models";
import axios from "axios";

function ImageAnalysis() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");
  const [base64Image, setBase64Image] = useState("");

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
      url: "/api/detect/",
      data: base64Image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(function (response) {
        //console.log(response.data);

        const jsonString = JSON.stringify(response.data, null, 2);
        // setResponse(jsonString);

        const analysis = response.data as Analysis;
        setResponse(analysis);
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
    </div>
  );
}

export default ImageAnalysis;
