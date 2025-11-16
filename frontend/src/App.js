import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/" className="hover:underline">Upload</Link>
        <Link to="/history" className="hover:underline">History</Link>
      </div>

      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
