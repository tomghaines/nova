'use client';

import { SearchBar } from '@/components/features/dashboard/command';
import React from 'react';
import MindshareLayout from '@/components/features/mindshare/mindshareLayout';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';
import SentimentDashboard from '@/components/features/dashboard/sentiment_analysis/sentimentDashboard';

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
      <div className='w-full p-4 text-center'>
        {/* Search Bar */}
        <div className='relative mb-12'>
          <SearchBar />
        </div>
        {/* Sentiment Analysis */}
        <SentimentDashboard key={selectedCoinSymbol} />
        {/* Mindshare Map  */}
        <MindshareLayout />
      </div>
    </div>
  );
}
