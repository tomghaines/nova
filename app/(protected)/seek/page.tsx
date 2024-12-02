'use client';

import { SearchBar } from '@/components/features/dashboard/command';
import MindshareLayout from '@/components/features/seek/mindshareLayout';
import React from 'react';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';
import SentimentDashboard from '@/components/features/seek/sentiment_analysis/sentimentDashboard';

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
    <div className='flex w-full flex-col items-center'>
      {/* Inner Container for Charts and Search */}
      <div className='w-full p-4 text-center'>
        {/* Search Bar */}
        <div className='relative mb-12 mt-32'>
          <SearchBar />
        </div>
        {/* AI-Summary */}
        <div className='AI-Summary'></div>
        {/* Sentiment Analysis */}
        <SentimentDashboard key={selectedCoinSymbol} />
        {/* Mindshare Map  */}
        <MindshareLayout />
      </div>
    </div>
  );
}
