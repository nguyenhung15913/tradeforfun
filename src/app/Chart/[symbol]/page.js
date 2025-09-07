"use client";

import { useParams, useSearchParams } from "next/navigation";
import TradingViewChart from "@/app/components/TradingViewChart";

export default function ChartPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const symbol = decodeURIComponent(params.symbol);
  const coinName = searchParams.get("name") || symbol;
  const coinDesc = searchParams.get("desc") || "No description available.";

  return (
    <main style={{ padding: "16px", background: "#0d1117", minHeight: "100vh" }}>
      <TradingViewChart
        initialSymbol={symbol}
        coinName={coinName}
        coinDesc={coinDesc}
      />
    </main>
  );
}
