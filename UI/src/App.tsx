import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import FileUploadRobo from "./FileUploadRobo";
import FileUploadLocal from "./FileUploadLocal";
import ImageAnalysis from "./ImageAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>MADHAT</h1>} />
          <Route path="/page2" element={<h2>MADHAT</h2>} />
          <Route path="/page3" element={<h3>MADHAT</h3>} />
          <Route path="/upload" element={<ImageAnalysis />} />
          <Route path="/upload-robo" element={<FileUploadRobo />} />
          <Route path="/upload-local" element={<FileUploadLocal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
