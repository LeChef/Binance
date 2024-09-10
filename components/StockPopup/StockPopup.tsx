import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  getHistoricalCandlestickData,
  CandlestickData,
} from "@/utils/stockUtils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Stock {
  symbol: string;
  price: number | null;
  change: number;
  imageUrl?: string | null; // Add this line
}

interface StockPopupProps {
  stock: Stock | null;
  onClose: () => void;
}

const StockPopup = ({ stock, onClose }: StockPopupProps) => {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);

  useEffect(() => {
    if (stock) {
      getHistoricalCandlestickData(stock.symbol).then((data) => {
        setChartData(data);
      });
    }
  }, [stock]);

  if (!stock) return null;

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick" as const,
      height: 350,
    },
    title: {
      text: `${stock.symbol} Last 180 Days`,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const series = [
    {
      data: chartData.map((candle) => ({
        x: new Date(candle.time),
        y: [candle.open, candle.high, candle.low, candle.close],
      })),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-black mr-2">{stock.symbol}</h2>
          {stock.imageUrl && (
            <Image
              src={stock.imageUrl}
              alt={`${stock.symbol} logo`}
              width={20}
              height={20}
              className="object-contain"
            />
          )}
        </div>
        <p className="text-black">Price: ${stock.price?.toFixed(2) ?? "N/A"}</p>
        <p className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
          Change: {stock.change.toFixed(2)}%
        </p>
        <div className="mt-4">
          {chartData.length > 0 && (
            <Chart
              options={chartOptions}
              series={series}
              type="candlestick"
              height={350}
            />
          )}
        </div>
        <button
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StockPopup;
