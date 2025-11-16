import { useState } from "react";
import { uploadCSV } from "../api";

function UploadPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    setErrorMsg("");
    setSummary(null);

    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setErrorMsg("Please upload a valid CSV file (.csv)");
      return;
    }

    setLoading(true);

    try {
      const result = await uploadCSV(file);
      if (!result || result.error) {
        setErrorMsg(result?.error || "Upload failed.");
      } else {
        setSummary(result.summary || result);
      }
    } catch {
      setErrorMsg("Something went wrong.");
    }

    setLoading(false);
  };

  const format = (val) => (typeof val === "number" ? val.toFixed(2) : "N/A");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl animate-fadeIn">
        
        <h1 className="text-5xl font-extrabold text-white text-center mb-6 tracking-wide drop-shadow-lg">
          Upload Your <span className="text-blue-400">CSV</span>
        </h1>

        <p className="text-center text-gray-300 mb-8 -mt-4">Process, analyze and generate report</p>

        <label
          htmlFor="fileInput"
          className="block border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer bg-white/5 text-gray-300 hover:border-blue-400 hover:bg-white/10 transition duration-300"
        >
          <span className="text-xl">Drag & Drop or Click to Upload</span>
        </label>

        <input type="file" id="fileInput" className="hidden" accept=".csv" onChange={handleUpload} />

        {loading && <p className="text-center mt-4 text-blue-300 font-semibold animate-pulse">Processing...</p>}

        {errorMsg && (
          <p className="mt-4 text-red-400 font-semibold text-center bg-red-900/40 border border-red-500/40 p-2 rounded-xl">
            {errorMsg}
          </p>
        )}

        {summary && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl animate-slideUp">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-5 shadow-lg border border-white/10 text-center hover:scale-105 transition">
                <p className="text-gray-300">Total Items</p>
                <p className="text-4xl font-extrabold text-blue-400">{summary.total}</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-5 shadow-lg border border-white/10 text-center hover:scale-105 transition">
                <p className="text-gray-300">Avg Flowrate</p>
                <p className="text-3xl font-bold text-green-400">{format(summary.avg_flowrate)}</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-5 shadow-lg border border-white/10 text-center hover:scale-105 transition">
                <p className="text-gray-300">Avg Temperature</p>
                <p className="text-3xl font-bold text-red-400">{format(summary.avg_temperature)}</p>
              </div>
            </div>

            <pre className="bg-black/30 border border-white/10 rounded-xl p-4 mt-6 text-gray-200 text-sm overflow-x-auto">
              {JSON.stringify(summary, null, 2)}
            </pre>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSummary(null)}
                className="px-6 py-2 rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 transition duration-300"
              >
                Reset
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
