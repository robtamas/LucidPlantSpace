import React, { useState } from "react";

function FileUpload() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");

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

    fetch("/api/detect/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        return response.json();
      })
      .then((data) => {
        const jsonString = JSON.stringify(data, null, 2);
        console.log(jsonString);
        setResponse(jsonString); // Set response data
      })
      .catch(() => alert("Upload failed"));
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

export default FileUpload;
