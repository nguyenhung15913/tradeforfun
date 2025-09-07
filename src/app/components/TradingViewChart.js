"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const RESOLUTION_LABELS = {
  "1": "1m",
  "60": "1h",
  "D": "1D",
  "M": "1M",
};

function loadTradingViewScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.TradingView) return resolve();

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load TradingView script"));
    document.head.appendChild(script);
  });
}

export default function TradingViewChart({ initialSymbol, coinName, coinDesc }) {
  const containerRef = useRef(null);

  const [symbol, setSymbol] = useState(initialSymbol);
  const [resolution, setResolution] = useState("D");
  const [livePrice, setLivePrice] = useState(null);

  // Create TradingView widget
  const createWidget = (sym, res) => {
    if (!containerRef.current || !window.TradingView) return;
    containerRef.current.innerHTML = "";
    new window.TradingView.widget({
      symbol: sym,
      interval: res,
      autosize: true,
      container_id: containerRef.current.id,
      theme: "dark",
      style: "1",
      toolbar_bg: "#1e1e1e",
      hide_side_toolbar: false,
      withdateranges: true,
      allow_symbol_change: false,
      timezone: "Etc/UTC",
      locale: "en",
      studies: [],
    });
  };

  // Load TradingView script
  useEffect(() => {
    let isMounted = true;
    loadTradingViewScript().then(() => {
      if (isMounted) createWidget(symbol, resolution);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Recreate widget when symbol/resolution changes
  useEffect(() => {
    if (window.TradingView) {
      createWidget(symbol, resolution);
    }
  }, [symbol, resolution]);

  // Live price WebSocket from Binance
  useEffect(() => {
    // Extract base symbol for Binance (e.g., BINANCE:BTCUSDT → btcusdt)
    const match = symbol.match(/BINANCE:(\w+)/i);
    if (!match) return;

    const pair = match[1].toLowerCase(); // e.g., btcusdt
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLivePrice(parseFloat(data.p)); // trade price
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {/* Header with back button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#fff" }}>{coinName}</h1>
          <p style={{ margin: "4px 0", color: "#bbb" }}>{coinDesc}</p>
          {livePrice && (
            <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#4caf50" }}>
              Live Price: ${livePrice.toLocaleString()}
            </p>
          )}
        </div>
        <Link
          href="/"
          style={{
            background: "#ff9800",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </Link>
      </div>

     
      {/* Chart container */}
      <div
        id="tv-advanced-chart"
        ref={containerRef}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}
