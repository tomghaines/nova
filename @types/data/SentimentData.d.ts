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
  id: number;
  icon: string;
  name: string;
  overall_analysis: string;
  overall_sentiment_score: number;
  symbol: string;
}

export interface ChartData {
  coinData: CoinData;
  keyPoints: KeyPoint[];
  weeklySentiment: WeeklySentiment[];
  topTweets: Tweet[];
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
