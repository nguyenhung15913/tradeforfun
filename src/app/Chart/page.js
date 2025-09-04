"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ChartPage() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/bitcoin")
      .then((res) => res.json())
      .then((data) => {
        const candles = data.prices.map((p) => {
          const time = p[0];
          const price = p[1];

          // Random bullish/bearish for demo
          const bullish = Math.random() > 0.5;
          let open, close;
          if (bullish) {
            open = price * (1 - Math.random() * 0.005);
            close = price * (1 + Math.random() * 0.005);
          } else {
            open = price * (1 + Math.random() * 0.005);
            close = price * (1 - Math.random() * 0.005);
          }

          const high = Math.max(open, close) * (1 + Math.random() * 0.002);
          const low = Math.min(open, close) * (1 - Math.random() * 0.002);

          return {
            x: new Date(time),
            y: [open, high, low, close],
          };
        });

        setSeries([{ data: candles }]);
      })
      .catch((err) => console.error("Error fetching chart data:", err))
      .finally(() => setLoading(false));
  }, []);

  const options = {
    chart: {
      type: "candlestick",
      background: "#131722",
      foreColor: "#d1d4dc",
      toolbar: { show: true },
    },
    title: {
      text: "Bitcoin Candlestick Chart",
      align: "left",
      style: { color: "#fff" },
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#d1d4dc" } },
    },
    yaxis: {
      opposite: true, // ✅ Move price labels to right
      tooltip: { enabled: true },
      labels: {
        style: { colors: "#d1d4dc" },
        formatter: (val) => val.toFixed(0), // ✅ Limit to whole numbers (6 figures if large)
      },
    },
    grid: {
      borderColor: "#1e222d",
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#26a69a", // green
          downward: "#ef5350", // red
        },
        columnWidth: "70%", // ✅ Make candles thicker
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📊 Bitcoin Candlestick Chart
      </h1>
      {loading ? (
        <p className="text-center text-gray-400">Loading chart...</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <Chart options={options} series={series} type="candlestick" height={500} />
        </div>
      )}
    </main>
  );
}
