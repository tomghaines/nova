'use client';

import React from 'react';
import SentimentDashboard from '@/components/features/dashboard/sentiment_analysis/sentimentDashboard';
import MindshareComponent from '@/components/features/discover/mindshare-analysis/mindshare';
import { SearchBar } from '@/components/features/dashboard/command';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';

export default function page() {
  return (
    <CoinProvider>
      <PageContent />
    </CoinProvider>
  );
}

export function PageContent() {
  const { selectedCoinSymbol } = useCoin();

  return (
    <div className='flex w-full flex-col items-center p-16'>
      {/* Inner Container for Charts and Search */}
      <div className='relative w-full max-w-[1400px] space-y-4 p-4'>
        {/* Search Bar */}
        <div className='relative flex flex-col gap-4'>
          <div className='relative'>
            <SearchBar />
          </div>

          {/* Sentiment Analysis */}
          <div className='w-full'>
            <SentimentDashboard key={selectedCoinSymbol} />
          </div>

          {/* Mindshare Analysis */}
          <div className='w-full transition-opacity duration-200 ease-in-out'>
            <MindshareComponent key={`mindshare-${selectedCoinSymbol}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
