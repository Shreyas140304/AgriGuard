import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";


function statsFrom(history) {
  const total = history.length;
  const healthy = history.filter((h) => h.label === "Healthy").length;
  const diseases = total - healthy;
  const avg =
    total === 0
      ? 0
      : Math.round(history.reduce((s, h) => s + h.confidence, 0) / total);

  return { total, healthy, diseases, avg };
}


const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3", "#9C27B0"];


export default function Dashboard({ history }) {
  const s = statsFrom(history);

  
  const pieData = [
    { name: "Healthy", value: s.healthy },
    { name: "Diseased", value: s.diseases },
  ];

 
  const diseaseCounts = {};
  history.forEach((h) => {
    if (h.label !== "Healthy") {
      diseaseCounts[h.label] = (diseaseCounts[h.label] || 0) + 1;
    }
  });

  const barData = Object.keys(diseaseCounts).map((d) => ({
    name: d,
    count: diseaseCounts[d],
  }));


  const lineData = history.map((h, index) => ({
    name: `Scan ${index + 1}`,
    confidence: h.confidence,
  }));

  return (
    <section>
      {/* ────────────── METRICS GRID ────────────── */}
      <div className="metrics-row">
        <div className="metric card">
          <h4>Total Scans</h4>
          <div className="big">{s.total}</div>
        </div>

        <div className="metric card">
          <h4>Healthy Plants</h4>
          <div className="big green">{s.healthy}</div>
        </div>

        <div className="metric card">
          <h4>Diseases Detected</h4>
          <div className="big red">{s.diseases}</div>
        </div>

        <div className="metric card">
          <h4>Avg. Confidence</h4>
          <div className="big purple">{s.avg}%</div>
        </div>
      </div>

      {/* If no data */}
      {history.length === 0 ? (
        <div className="card full-card empty-state">
          <div className="big-icon">📈</div>
          <p className="muted">
            No data available yet. Upload and analyze images to see dashboard
            metrics
          </p>
        </div>
      ) : (
        <>
          {/* ────────────── PIE CHART ────────────── */}
          <div className="card full-card" style={{ marginTop: "20px" }}>
            <h3>Healthy vs Diseased Plants</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* ────────────── BAR CHART ────────────── */}
          <div className="card full-card" style={{ marginTop: "20px" }}>
            <h3>Disease Frequency</h3>
            <BarChart width={600} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF5722" />
            </BarChart>
          </div>

          {/* ────────────── LINE CHART ────────────── */}
          <div className="card full-card" style={{ marginTop: "20px" }}>
            <h3>Confidence Trend Over Time</h3>
            <LineChart width={600} height={300} data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#3F51B5"
                strokeWidth={3}
              />
            </LineChart>
          </div>
        </>
      )}
    </section>
  );
}
