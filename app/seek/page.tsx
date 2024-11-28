'use client'

import { SentimentChart } from '@/components/dashboard/sentimentChart';
import { MindshareMap } from '@/components/dashboard/mindshareMap';
import { SearchBar } from '@/components/dashboard/command';

import React, { useState, useEffect } from 'react';

function ProgressBar({ progress }) {
  return (
    <div className='w-[40%] mx-auto h-4 bg-gray-200 rounded-full overflow-hidden'>
      <div
        className='h-full bg-blue-500'
        style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}
      />
    </div>
  );
}

export default function page() {
  const [isSentimentChartLoading, setIsSentimentChartLoading] = useState(true);
  const [isMindshareMapLoading, setIsMindshareMapLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isSentimentChartLoading || isMindshareMapLoading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000); // Hide progress bar after 1 second
    }

    return () => clearInterval(interval);
  }, [isSentimentChartLoading, isMindshareMapLoading]);

  return (
    <div className='flex w-full flex-col items-center justify-start'>
      {/* Inner Container for Charts and Search */}
      <div className='w-[100%] max-w-4xl px-6 text-center'>
        {/* Search Bar */}
        <div className='relative mb-16 ml-10'>
          <SearchBar />
        </div>
        <div className='AI-Summary'></div>
        {/* Sentiment Chart Section */}
        <div className='mb-16 mt-20'>
          <h1 className='mb-4 ml-20 text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Sentiment Analysis
          </h1>
          <p className='mb-6 ml-20 text-gray-600 dark:text-gray-400'>
            The use of natural language processing, text analysis, computational
            linguistics based on X (formerly Twitter) to systematically study
            the market behaviors.
          </p>
          {(isSentimentChartLoading || isMindshareMapLoading) && (
          <ProgressBar progress={progress} />
        )}
          <SentimentChart onLoad={() => setIsSentimentChartLoading(false)} />

        </div>

        {/* Mindshare Map Section */}
        <div>
          <h1 className='mb-4 ml-20 text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Mindshare Map
          </h1>
          <p className='mb-6 ml-20 text-gray-600 dark:text-gray-400'>
            A systematic representation of how the collective attention on X
            shifts across critical concepts, aiding in understanding market
            trends and focus distribution.
          </p>
          {isMindshareMapLoading && (
            <ProgressBar className='w-[40%] mx-auto' />
          )}
          <MindshareMap onLoad={() => setIsMindshareMapLoading(false)} />
        </div>
      </div>
    </div>
  );
}
