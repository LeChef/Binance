"use client";

import { useState, useEffect } from "react";
import StockTicker from "@/components/StockTicker/StockTicker";
import AddTicker from "@/components/AddTicker/AddTicker";
import SearchModal from "@/components/SearchModal/SearchModal";
import { getStockPrice } from "@/utils/stockUtils";
import StockPopup from "@/components/StockPopup/StockPopup";
import CorrelationTable from "@/components/CorrelationTable/CorrelationTable";
import { getHistoricalData } from "@/utils/stockUtils";
import { Stock } from "@/types/stock";

// Function to check if a symbol exists and get its current price

export default function Component() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [historicalData, setHistoricalData] = useState<{
    [symbol: string]: number[];
  }>({});

  const addStock = async (symbol: string): Promise<boolean> => {
    if (stocks.some((stock) => stock.symbol === symbol)) {
      return false; // Indicates failure (duplicate stock)
    }

    const price = await getStockPrice(symbol);
    if (price !== null) {
      const newStock = { symbol, price, change: 0 };
      setStocks((prevStocks) => [...prevStocks, newStock]);
      return true; // Indicates success
    } else {
      alert(`Symbol ${symbol} not found or error occurred.`);
      return false; // Indicates failure (stock not found)
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    symbol: string
  ) => {
    e.dataTransfer.setData("text/plain", symbol);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    const draggedSymbol = e.dataTransfer.getData("text/plain");
    const draggedIndex = stocks.findIndex(
      (stock) => stock.symbol === draggedSymbol
    );

    if (draggedIndex === targetIndex) return;

    const newStocks = [...stocks];
    const [draggedStock] = newStocks.splice(draggedIndex, 1);
    newStocks.splice(targetIndex, 0, draggedStock);

    setStocks(newStocks);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(stocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStocks(items);
  };

  useEffect(() => {
    const updatePrices = async () => {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const newPrice = await getStockPrice(stock.symbol);
          if (newPrice !== null) {
            const priceChange =
              stock.price !== null
                ? ((newPrice - stock.price) / stock.price) * 100
                : 0;
            return { ...stock, price: newPrice, change: priceChange };
          }
          return stock;
        })
      );
      setStocks(updatedStocks);
    };

    const intervalId = setInterval(updatePrices, 1000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [stocks]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const newHistoricalData: { [symbol: string]: number[] } = {};
      for (const stock of stocks) {
        const data = await getHistoricalData(stock.symbol);
        if (data) {
          newHistoricalData[stock.symbol] = data;
        }
      }
      setHistoricalData(newHistoricalData);
    };

    fetchHistoricalData();
  }, [stocks]);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const closePopup = () => {
    setSelectedStock(null);
  };

  const handleDeleteStock = (symbol: string) => {
    setStocks((prevStocks) =>
      prevStocks.filter((stock) => stock.symbol !== symbol)
    );
    setHistoricalData((prevData) => {
      const newData = { ...prevData };
      delete newData[symbol];
      return newData;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Crypto Ticker Panel
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {stocks.map((stock, index) => (
          <div
            key={stock.symbol}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <StockTicker
              stock={stock}
              onClick={handleStockClick}
              onDelete={handleDeleteStock}
              onDragStart={handleDragStart}
            />
          </div>
        ))}
        <AddTicker onClick={() => setIsModalOpen(true)} />
      </div>
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addStock}
      />
      <StockPopup stock={selectedStock} onClose={closePopup} />
      <CorrelationTable stocks={stocks} historicalData={historicalData} />
    </div>
  );
}
