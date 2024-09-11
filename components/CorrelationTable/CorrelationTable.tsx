import { useMemo } from "react";
import { Stock } from "@/types/stock";
import InfoButton from "../InfoButton/InfoButton";

interface CorrelationTableProps {
  stocks: Stock[];
  historicalData: { [symbol: string]: number[] };
}

function calculateCorrelation(data1: number[], data2: number[]): number {
  const n = Math.min(data1.length, data2.length);
  if (n < 2) return 0;

  const mean1 = data1.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const mean2 = data2.slice(0, n).reduce((a, b) => a + b, 0) / n;

  const variance1 = data1
    .slice(0, n)
    .reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
  const variance2 = data2
    .slice(0, n)
    .reduce((a, b) => a + Math.pow(b - mean2, 2), 0);

  const covariance = data1
    .slice(0, n)
    .reduce((a, b, i) => a + (b - mean1) * (data2[i] - mean2), 0);

  return covariance / Math.sqrt(variance1 * variance2);
}

export default function CorrelationTable({
  stocks,
  historicalData,
}: CorrelationTableProps) {
  const correlations = useMemo(() => {
    const result: { [key: string]: { [key: string]: number } } = {};
    stocks.forEach((stock1, i) => {
      result[stock1.symbol] = {};
      stocks.forEach((stock2, j) => {
        if (i !== j) {
          const correlation = calculateCorrelation(
            historicalData[stock1.symbol] || [],
            historicalData[stock2.symbol] || []
          );
          result[stock1.symbol][stock2.symbol] = correlation;
        } else {
          result[stock1.symbol][stock2.symbol] = 1; // Perfect correlation with itself
        }
      });
    });
    return result;
  }, [stocks, historicalData]);

  const infoContent = (
    <p>
      Shows the correlation between different crypto coins based on 6 months of
      historical data.
    </p>
  );

  return (
    <div className="mt-8 px-2 sm:px-0">
      <div className="flex items-center mb-4 relative">
        <h1 className="text-xl sm:text-2xl font-bold text-white mr-2">
          Correlation Table
        </h1>
        <InfoButton content={infoContent} position="bottom-left" />
      </div>
      {stocks.length < 2 ? (
        <p className="text-gray-400 mt-4 italic">
          To show correlation, add 2 or more Tickers to the panel.
        </p>
      ) : (
        <div className="mt-4 bg-white bg-opacity-10 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-600 p-2"></th>
                {stocks.map((stock) => (
                  <th key={stock.symbol} className="p-2 bg-gray-600">
                    <div className="text-white text-xs sm:text-sm whitespace-nowrap">
                      {stock.symbol}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock1) => (
                <tr key={stock1.symbol}>
                  <th className="sticky left-0 z-10 bg-gray-600 p-2">
                    <div className="text-white text-xs sm:text-sm whitespace-nowrap">
                      {stock1.symbol}
                    </div>
                  </th>
                  {stocks.map((stock2) => {
                    const correlation =
                      correlations[stock1.symbol]?.[stock2.symbol];
                    const bgColor =
                      correlation < 0 ? "bg-red-500" : "bg-green-500";
                    return (
                      <td
                        key={`${stock1.symbol}-${stock2.symbol}`}
                        className={`p-2 ${
                          stock1.symbol === stock2.symbol
                            ? "bg-gray-400"
                            : bgColor
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {correlation?.toFixed(2) || "-"}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
