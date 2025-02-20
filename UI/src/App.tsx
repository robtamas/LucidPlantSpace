import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import FileUpload from "./FileUpload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>MADHAT</h1>} />
          <Route path="/page2" element={<h2>MADHAT</h2>} />
          <Route path="/page3" element={<h3>MADHAT</h3>} />
          <Route path="/upload" element={<FileUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
