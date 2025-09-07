"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ import Link for navigation

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch coins from backend
  const fetchCoins = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coins");
      const data = await res.json();
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCoins();

    // Poll every 1 second
    const interval = setInterval(fetchCoins, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          🚀 Live Crypto Market
        </h1>

    
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading coins...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => {
  const tvSymbol = coin.symbol.toUpperCase() === "USDT" ? "USDT" : `BINANCE:${coin.symbol.toUpperCase()}USDT`;
  return (
    <div key={coin.id} className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform">
      <img src={coin.image} alt={coin.name} className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold">{coin.name}</h2>
      <p className="text-gray-400 uppercase">{coin.symbol}</p>
      <p className="mt-2 text-lg font-bold">
        ${coin.current_price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400">
        Market Cap: ${coin.market_cap.toLocaleString()}
      </p>
      <p
        className={`mt-2 font-semibold ${
          coin.price_change_percentage_24h >= 0
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {coin.price_change_percentage_24h.toFixed(2)}%
      </p>

      {/* New button */}
      <Link
        href={`/Chart/${tvSymbol}`}
        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        View Chart
      </Link>
    </div>
  );
})}
        </div>
      )}
    </main>
  );
}
