export interface SentimentData {
  id: number;
  sentimentValue: number;
  date: string;
  price: number;
  analysis: string;
}

export interface KeyPoint {
  type: 'bullish' | 'bearish';
  point: string;
}

export interface WeeklySentiment {
  date_range: string;
  sentiment_score: number;
  summary: string;
  price: number;
}

export interface CoinData {
  icon: string;
  name: string;
}

export interface ChartData {
  coinData: CoinData;
  keyPoints: KeyPoint[];
  weeklySentiment: WeeklySentiment[];
}

export interface SentimentPoint {
  date: Date;
  sentimentValue: number;
  analysis: string;
  price: number;
}

export interface SentimentStats {
  avgSentiment: string;
  maxSentiment: string;
  minSentiment: string;
  priceChange: string;
}
