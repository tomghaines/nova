'use client';

import { MindshareMap } from '@/components/features/dashboard/mindshareMap';
import { SearchBar } from '@/components/features/dashboard/command';
import { SkeletonBar } from '@/components/features/dashboard/skeleton';
import SentimentLayout from '@/components/features/seek/sentimentLayout';
import React, { useState } from 'react';

export default function page() {
  const [isMindshareMapLoading, setIsMindshareMapLoading] = useState(true);

  return (
    <div className='flex w-full flex-col items-center justify-start'>
      {/* Inner Container for Charts and Search */}
      <div className='w-full max-w-4xl px-6 text-center'>
        {/* Search Bar */}
        <div className='relative mb-16 ml-10'>
          <SearchBar />
        </div>

        {/* AI-Summary */}
        <div className='AI-Summary'></div>

        {/* Sentiment Layout Section */}
        <SentimentLayout />

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
