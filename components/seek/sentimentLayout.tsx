'use client';

import { SentimentChart2 } from '@/components/dashboard/sentiment2';
import { SkeletonBar } from '@/components/dashboard/skeleton';
import { ChartLine, TrendingUp, TrendingDown } from 'lucide-react';
import React, { useState } from 'react';

export default function SentimentLayout() {
  const [isSentimentChartLoading, setIsSentimentChartLoading] = useState(true);

  return (
    <div className='border'>
      {/* Sentiment Chart Section - Heading */}
      <div className='flex h-8 w-full border-zinc-300 bg-zinc-300 pl-4 pt-1 text-left font-sans font-medium text-gray-500'>
        <ChartLine className='mr-2 mt-1 h-4 w-4' /> Sentiment Analysis
      </div>
      {/* Sentiment Chart Section - Inner */}
      <div className='mb-8 ml-6 mr-6 mt-8 flex flex-col items-center justify-start border'>
        {isSentimentChartLoading && <SkeletonBar />}
        <SentimentChart2
          onLoadComplete={() => setIsSentimentChartLoading(false)}
        />
      </div>

      {/* Sentiment Chart Section - Opinions */}
      <div className='flex justify-between gap-x-6'>
        {/* Sentiment Chart Section - Opinions Bullish */}
        <div className='mb-6 ml-6 h-40 w-1/2 border-2'>
          <div className='flex h-8 w-full border-zinc-300 bg-zinc-300 pl-4 pt-1 text-left font-sans font-medium text-gray-500'>
            <TrendingUp className='mr-2 mt-1 h-4 w-4' /> Bullish
          </div>
        </div>
        {/* Sentiment Chart Section - Opinions Bearish */}
        <div className='mb-6 mr-6 h-40 w-1/2 border-2'>
          <div className='flex h-8 w-full border-zinc-300 bg-zinc-300 pl-4 pt-1 text-left font-sans font-medium text-gray-500'>
            <TrendingDown className='mr-2 mt-1 h-4 w-4' /> Bearish
          </div>
        </div>
      </div>
    </div>
  );
}
