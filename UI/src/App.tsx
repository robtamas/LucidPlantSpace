import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import ImageAnalysis from './ImageAnalysis';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<ImageAnalysis />} />
					<Route path="/page2" element={<h2>MADHAT</h2>} />
					<Route path="/page3" element={<h3>MADHAT</h3>} />
					<Route path="/upload" element={<ImageAnalysis />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
