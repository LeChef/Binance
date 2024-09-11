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
      type: "candlestick",
      height: 350,
      background: "#1F2937", // Dark background for the chart
      foreColor: "#D1D5DB", // Light text color for better contrast
    },
    title: {
      text: `${stock.symbol} Last 180 Days`,
      align: "left",
      style: {
        color: "#D1D5DB", // Light text color for the title
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value) => value.toFixed(2),
      },
    },
    tooltip: {
      theme: "dark",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-white mr-2">{stock.symbol}</h2>
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
        <p className="text-white">Price: ${stock.price?.toFixed(2) ?? "N/A"}</p>
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
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockPopup;
