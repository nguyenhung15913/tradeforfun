export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tvRes = await fetch(
      `https://symbol-search.tradingview.com/symbol_search/?text=${encodeURIComponent(
        q
      )}&type=stock,crypto`
    );

    if (!tvRes.ok) {
      return new Response(JSON.stringify([]), {
        status: tvRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await tvRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Symbol search error:", err);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
