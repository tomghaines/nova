'use client';

import { SearchBar } from '@/components/features/dashboard/command';
import MindshareLayout from '@/components/features/seek/mindshareLayout';
import React from 'react';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';
import SentimentChart from '@/components/features/seek/sentimentChart';

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
      <div className='w-full max-w-5xl px-6 text-center'>
        {/* Search Bar */}
        <div className='relative mb-16'>
          <SearchBar />
        </div>

        {/* AI-Summary */}
        <div className='AI-Summary'></div>

        {/* Sentiment Layout Section */}
        <SentimentChart key={selectedCoinSymbol} />

        {/* Mindshare Map Section */}
        <MindshareLayout />
      </div>
    </div>
  );
}
