import React, { useState, useMemo, useEffect } from 'react';
import { useCoin } from '@/app/context/CoinContext';
import { ChartData, SentimentPoint } from '@/@types/data/SentimentData';
import SentimentBoxes from './sentimentBoxes';
import TopPosts from './topPosts';
import fetchSentimentData from '@/lib/database/SentimentData';
import SentimentStats from './sentimentStats';
import SentimentSummary from './sentimentSummary';
import LoadingBar from '../../../ui/loader';
import SentimentChart from './sentimentChart';
import NewsSentiment from './newsSentiment';
import SentimentCorrelation from './sentimentCorrelation';
import PredictiveMetrics from './predictiveMetrics';
import SearchBar from '../command';

interface SentimentDashboardProps {
  onLoadComplete?: () => void;
}

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({
  onLoadComplete
}) => {
  const { selectedCoinSymbol } = useCoin();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSentimentData(selectedCoinSymbol);
        setChartData(data);
      } catch (err) {
        console.error(err);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [selectedCoinSymbol]);

  const overallData = useMemo(() => {
    if (!chartData?.coinData) return null;
    return {
      coin: chartData.coinData.name,
      totalScore: chartData.coinData.overall_sentiment_score,
      overallAnalysis: chartData.coinData.overall_analysis
    };
  }, [chartData]);

  const sentimentData = useMemo<SentimentPoint[]>(() => {
    if (!chartData?.weeklySentiment) return [];

    return chartData.weeklySentiment
      .map((week) => {
        const [month, days] = week.date_range.split(' ');
        const [startDay] = days.split('-');
        const monthMap: { [key: string]: number } = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11
        };
        return {
          date: new Date(2024, monthMap[month], parseInt(startDay)),
          sentimentValue: week.sentiment_score,
          analysis: week.summary,
          price: week.price
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [chartData]);

  return (
    <div className='bg relative flex h-full w-full flex-col gap-2 overflow-hidden p-2'>
      <LoadingBar isLoading={isLoading} />

      {/* Main Content */}
      {/* Top Bar */}
      <div className='flex gap-2'>
        <div className='relative w-[20%] lg:w-[30%]'>
          <SearchBar />
        </div>
        <div className='w-full'>
          <SentimentStats data={chartData} />
        </div>
      </div>
      <div className='flex h-full flex-col gap-2 lg:flex-row'>
        {/* Left Column */}
        <div className='flex w-full flex-col gap-2 lg:w-[60%]'>
          <div className='h-[55%] rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30'>
            <SentimentChart
              data={sentimentData}
              onLoadComplete={onLoadComplete}
            />
          </div>
          <div className='flex h-[45%] gap-2'>
            <div className='h-full w-[55%]'>
              <SentimentSummary coinData={overallData} />
            </div>
            <div className='flex w-[45%] flex-col gap-2'>
              <NewsSentiment data={chartData} />

              <SentimentCorrelation data={chartData} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='flex h-full w-full flex-col gap-2 lg:w-[45%]'>
          <div className='h-1/4'>
            <PredictiveMetrics data={chartData} />
          </div>
          <div className='h-2/4'>
            <TopPosts weeklyData={chartData?.weeklySentiment || []} />
          </div>
          <div className='1/4 h-full'>
            <SentimentBoxes keyPoints={chartData?.keyPoints || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentDashboard;
