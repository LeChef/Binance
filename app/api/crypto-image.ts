import { NextResponse } from "next/server";

const COINGECKO_API_KEY = "CG-UUQ5YQ6CTpT9eFPV7DP8g9aW";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");

  if (!coinId) {
    return NextResponse.json({ error: "Invalid coin ID" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("CoinGecko API response:", data); // Add this line for debugging
    return NextResponse.json({ imageUrl: data.image.small });
  } catch (error) {
    console.error("Error fetching crypto image:", error);
    return NextResponse.json(
      { error: "Failed to fetch crypto image" },
      { status: 500 }
    );
  }
}
