'use client';

import { SentimentChart } from '@/components/features/seek/sentimentChart';
import { SkeletonBar } from '@/components/features/dashboard/skeleton';
import { ChartLine, TrendingUp, TrendingDown, Info } from 'lucide-react';
import React, { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/features/sidebar/avatar';

export default function SentimentLayout() {
  const [isSentimentChartLoading, setIsSentimentChartLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('Last 12m')

  return (
    <div className='border border-zinc-800 dark:border-zinc-100 '>
      {/* Sentiment Chart Section - Heading */}
      <div className='flex h-8 w-full border-zinc-800 bg-black pl-4 pt-1 text-left font-sans font-medium text-gray-100 dark:invert'>
        <ChartLine className='mr-2 mt-1 h-4 w-4' /> Sentiment Analysis
      </div>
      {/* Label: Generated by AI */}
      <div className='ml-6 mt-3 flex h-6 w-1/6 items-center border text-center text-xs text-gray-800 border-zinc-400 dark:invert'>
        <Info className='ml-2 mr-2 h-3 w-3' />
        Generated by AI
      </div>
      {/* Sentiment Chart Section - Inner */}
      <div className='mb-8 ml-6 mr-6 mt-4 flex flex-col items-start justify-center border border-zinc-400'>
      <div className='flex flex-row justify-between items-centers w-[720px] ml-3'>
        {/* Left side: Avatar and h1 */}
        <div className='flex flex-row items-center mt-5 mb-5'>
          <Avatar className='h-6 w-auto'>
            <AvatarImage src='https://cryptologos.cc/logos/bitcoin-btc-logo.png' />
            <AvatarFallback></AvatarFallback> 
          </Avatar>
          <h1 className='font-sans font-medium ml-2 text-lg'>BTC</h1>
        </div>
        {/* Right side: Select TimePeriod dropdown */}
        <select className='h-7 pl-1 pr-1 border border-zinc-400 text-xs text-gray-800 leading-tight mt-5 dark:invert' value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
          <option value="Last 12m">Last 12m</option>
          <option value="Last 6m">Last 6 months</option>
          <option value="Last 3m">Last 3 months</option>
          <option value="Last 1m">Last 1 month</option>
        </select>
      </div>
      {isSentimentChartLoading && <SkeletonBar />}
      <SentimentChart
        timePeriod={timePeriod}
        onLoadComplete={() => setIsSentimentChartLoading(false)}
      />
      </div>

      {/* Sentiment Chart Section - Opinions */}
      <div className='flex justify-between gap-x-6'>
        {/* Sentiment Chart Section - Opinions Bullish */}
        <div className='mb-6 ml-6 h-40 w-1/2 border border-zinc-400 dark:invert'>
          <div className='flex h-8 w-full border-zinc-400 bg-black pl-4 pt-1 text-left font-sans font-medium text-gray-100 dark:invert'>
            <TrendingUp className='mr-2 mt-1 h-4 w-4' /> Bullish
          </div>
        </div>
        {/* Sentiment Chart Section - Opinions Bearish */}
        <div className='mb-6 mr-6 h-40 w-1/2 border border-zinc-400 dark:invert'>
          <div className='flex h-8 w-full border-zinc-400 bg-black pl-4 pt-1 text-left font-sans font-medium text-gray-100 dark:invert'>
            <TrendingDown className='mr-2 mt-1 h-4 w-4' /> Bearish
          </div>
        </div>
      </div>
    </div>
  );
}
