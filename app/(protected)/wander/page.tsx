import React from 'react';
import HotTweet from '@/components/features/wander/hotTweet';
import HotNarrative from '@/components/features/wander/hotNarrative';
import { mockData } from './mockData';

export default function Page() {
  return (
    <div className='mt-8 flex h-[1000px] flex-col flex-wrap gap-6 p-6'>
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
