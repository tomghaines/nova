'use client';

import { SentimentChart } from '@/components/dashboard/sentimentChart';
import { MindshareMap } from '@/components/dashboard/mindshareMap';
import { SearchBar } from '@/components/dashboard/command';
import { SkeletonBar } from '@/components/dashboard/skeleton';
import { ChartLine } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function page() {
  const [isSentimentChartLoading, setIsSentimentChartLoading] = useState(true);
  const [isMindshareMapLoading, setIsMindshareMapLoading] = useState(true);

  return (
    <div className='flex w-full flex-col items-center justify-start'>
      {/* Inner Container for Charts and Search */}
      <div className='w-[100%] max-w-4xl px-6 text-center'>
        {/* Search Bar */}
        <div className='relative mb-16 ml-10'>
          <SearchBar />
        </div>

        {/* AI-Summary */}
        <div className='AI-Summary'></div>

        {/* Sentiment Chart Section - Outer */}
        <div className='border bg-zinc-50'>
          {/* Sentiment Chart Section - Heading */}
          <div className='flex h-8 w-full border-zinc-300 bg-zinc-300 pl-4 pt-1 text-left font-sans font-medium text-gray-500'>
            <ChartLine className='mr-2 mt-1 h-4 w-4' /> Sentiment Analysis
          </div>
          {/* Sentiment Chart Section - Inner */}
          <div className='mb-8 ml-6 mr-6 mt-8 flex flex-col items-center justify-start border'>
            {/* <h1 className='mb-4 ml-20 text-4xl font-bold text-gray-800 dark:text-gray-100'>
              Sentiment Analysis
            </h1>
            <p className='mb-6 ml-20 text-gray-600 dark:text-gray-400'>
              The use of natural language processing, text analysis, computational
              linguistics based on X (formerly Twitter) to systematically study
              the market behaviors.
            </p> */}
            {isSentimentChartLoading && <SkeletonBar />}
            <SentimentChart
              onLoadComplete={() => setIsSentimentChartLoading(false)}
            />
          </div>
        </div>

        {/* Mindshare Map Section */}
        <div className='flex flex-col items-center justify-center'>
          <h1 className='mb-4 ml-20 mt-10 text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Mindshare Map
          </h1>
          <p className='mb-6 ml-20 text-gray-600 dark:text-gray-400'>
            A systematic representation of how the collective attention on X
            shifts across critical concepts, aiding in understanding market
            trends and focus distribution.
          </p>
          {isMindshareMapLoading && <SkeletonBar />}
          <MindshareMap
            onLoadComplete={() => setIsMindshareMapLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
