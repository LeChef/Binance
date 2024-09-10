export interface Stock {
  symbol: string;
  price: number | null;
  change: number;
  imageUrl?: string | null;
}
