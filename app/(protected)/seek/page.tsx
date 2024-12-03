'use client';

import { SearchBar } from '@/components/features/dashboard/command';
import React, { useState } from 'react';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';
import SentimentDashboard from '@/components/features/dashboard/sentiment_analysis/sentimentDashboard';
import MindshareComponent from '@/components/features/seek/mindshare-analysis/mindshare';

export default function page() {
  return (
    <CoinProvider>
      <PageContent />
    </CoinProvider>
  );
}

export function PageContent() {
  const { selectedCoinSymbol } = useCoin();
  const [isLoadingMindshare, setIsLoadingMindshare] = useState(true);

  const handleMindshareLoadComplete = () => {
    setIsLoadingMindshare(false);
  };

  return (
    <div className='flex w-full flex-col items-center p-16'>
      {/* Inner Container for Charts and Search */}
      <div className='relative w-full max-w-[1400px] space-y-4 p-4'>
        {/* Search Bar */}
        <div className='relative mb-12'>
        <div className='relative'>
          <SearchBar />
        </div>

        {/* Sentiment Analysis */}
        <div className='w-full'>
          <SentimentDashboard key={selectedCoinSymbol} />
        </div>

        {/* Mindshare Analysis */}
        <div className='w-full transition-opacity duration-200 ease-in-out'>
          <MindshareComponent
            key={`mindshare-${selectedCoinSymbol}`}
            onLoadComplete={handleMindshareLoadComplete}
          />
        </div>
      </div>
    </div>
  );
}
