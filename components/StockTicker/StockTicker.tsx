import React, { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import Image from "next/image";
import coinDataRaw from "@/utils/coinData.txt";
import { CoinData } from "@/types/coinData"; // Create this type

const coinData: CoinData[] = JSON.parse(coinDataRaw);

interface StockTickerProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
  onDelete: (symbol: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, symbol: string) => void;
}

const formatPrice = (price: number | null): string => {
  if (price === null) return "N/A";
  if (price >= 1 || price <= -1) {
    return `$${price.toFixed(3)}`;
  } else {
    const [, decimal] = price.toString().split(".");
    const significantDigits = decimal.match(/[1-9]/);
    const precision =
      significantDigits && significantDigits.index !== undefined
        ? significantDigits.index + 4
        : 4;
    return `$${price.toFixed(precision)}`;
  }
};

const findCoinId = (symbol: string): string | null => {
  const coin = coinData.find(
    (c: CoinData) => c.symbol.toLowerCase() === symbol.toLowerCase()
  );
  return coin ? coin.id : null;
};

const COINGECKO_API_KEY = "CG-UUQ5YQ6CTpT9eFPV7DP8g9aW";

const fetchCryptoImage = async (symbol: string): Promise<string | null> => {
  const coinId = findCoinId(symbol);
  if (!coinId) {
    console.error(`Coin ID not found for symbol: ${symbol}`);
    return null;
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
    return data.image.small;
  } catch (error) {
    console.error("Error fetching crypto image:", error);
    return null;
  }
};

const StockTicker: React.FC<StockTickerProps> = ({
  stock,
  onClick,
  onDelete,
  onDragStart,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCryptoImage(stock.symbol).then(setImageUrl);
  }, [stock.symbol]);

  return (
    <div
      className="bg-card text-card-foreground p-4 rounded-lg shadow-sm flex flex-col justify-between h-full relative cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, stock.symbol)}
    >
      <div
        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(stock.symbol);
        }}
      >
        <span className="text-white font-bold">×</span>
      </div>
      <div
        className="font-bold cursor-pointer flex items-center"
        onClick={() => onClick({ ...stock, imageUrl })}
      >
        <span>{stock.symbol}</span>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${stock.symbol} logo`}
            width={20}
            height={20}
            className="ml-2"
          />
        )}
      </div>
      <div className="text-2xl">{formatPrice(stock.price)}</div>
      <div className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
        {stock.change.toFixed(2)}%
      </div>
    </div>
  );
};

export default StockTicker;
