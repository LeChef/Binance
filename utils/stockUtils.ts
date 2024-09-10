export const getStockPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
    );
    if (!response.ok) {
      throw new Error("Symbol not found");
    }
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
};

// ... existing getStockPrice function

export const getHistoricalData = async (symbol: string): Promise<number[]> => {
  try {
    const endTime = Date.now();
    const startTime = endTime - 180 * 24 * 60 * 60 * 1000; // 180 days ago
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&startTime=${startTime}&endTime=${endTime}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch historical data");
    }
    const data = await response.json();
    return data.map((candle: any[]) => parseFloat(candle[4])); // Close prices
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
};

// ... existing code ...

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const getHistoricalCandlestickData = async (
  symbol: string
): Promise<CandlestickData[]> => {
  try {
    const endTime = Date.now();
    const startTime = endTime - 180 * 24 * 60 * 60 * 1000; // 180 days ago
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&startTime=${startTime}&endTime=${endTime}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch historical data");
    }
    const data = await response.json();
    return data.map((candle: any[]) => ({
      time: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
};
