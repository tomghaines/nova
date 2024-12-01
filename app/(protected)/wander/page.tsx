import React from 'react';
import HotTweet from '@/components/features/wander/hotTweet';
import HotNarrative from '@/components/features/wander/hotNarrative';
import { mockData } from './mockData';

export default function Page() {
  return (
    <div className='mt-8 flex h-[1000px] flex-col flex-wrap gap-6 p-6'>
      <div>
        <h1 className='ml-6 text-6xl font-black'>Monday</h1>
        <h3 className='font-heavy ml-6 mt-2 text-xl'>Dec 1, 2024</h3>
        <p className='ml-6 mt-1'>Top trends, served fresh daily.</p>
      </div>
      {mockData
        .sort((a, b) => b.significance - a.significance)
        .map((card, index) => {
          const randomColor = `var(--branding-${Math.floor(Math.random() * 6) + 1})`;
          return (
            <div
              key={index}
              className='w-[calc(33.333%-1rem)]'
              style={{ backgroundColor: randomColor }}
            >
              {card.type === 'tweet' ? (
                <HotTweet
                  label={card.label}
                  title={card.title}
                  content={card.content}
                />
              ) : (
                <HotNarrative label={card.label} />
              )}
            </div>
          );
        })}
    </div>
  );
}
