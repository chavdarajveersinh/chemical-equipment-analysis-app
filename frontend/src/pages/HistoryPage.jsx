import { useEffect, useState } from "react";
import { getHistory } from "../api";
import ChartCard from "../components/ChartCard";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    })();
  }, []);

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <p className="text-gray-300 text-lg bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md">
          No history available. Please upload a CSV file.
        </p>
      </div>
    );
  }

  const flowRateValues = history.map((h) => h.summary.avg_flowrate || 0);
  const labels = history.map((h) => `Record ${h.id}`);

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Average Flowrate",
        data: flowRateValues,
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2
      }
    ]
  };

  const typeTotals = history.reduce((acc, h) => {
    const typeData = h.summary.type_distribution || {};
    for (const t in typeData) {
      acc[t] = (acc[t] || 0) + typeData[t];
    }
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(typeTotals),
    datasets: [
      {
        data: Object.values(typeTotals),
        backgroundColor: [
          "rgba(59,130,246,0.7)",
          "rgba(16,185,129,0.7)",
          "rgba(239,68,68,0.7)",
          "rgba(234,179,8,0.7)",
          "rgba(147,51,234,0.7)"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
        Upload History
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 transition duration-300 hover:scale-[1.01]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-200 font-medium">Record #{item.id}</p>
              <span className="text-xs px-3 py-1 bg-white/10 text-gray-300 border border-white/20 rounded-full">
                {new Date(item.uploaded_at).toLocaleString()}
              </span>
            </div>

            <div className="mt-4 bg-black/20 border border-white/10 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-blue-100 font-mono leading-relaxed">
                {JSON.stringify(item.summary, null, 2)}
              </pre>
            </div>

            <div className="mt-5 flex justify-end">
              <a
                href={`http://127.0.0.1:8000/api/report/${item.id}/`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition font-medium"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-14">
          <ChartCard title="Flowrate Comparison">
            <Bar data={barChartData} />
          </ChartCard>

          <ChartCard title="Equipment Type Distribution">
            <Pie data={pieChartData} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
