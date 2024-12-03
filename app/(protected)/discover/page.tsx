import React from 'react';
import HotTweet from '@/components/features/wander/hotTweet';
import HotNarrative from '@/components/features/wander/hotNarrative';
import { mockData } from '../../../components/features/wander/weeklyData';

export default function Page() {
  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className='flex h-[1000px] flex-col flex-wrap gap-6 p-6 text-gray-800'>
      <div className='border-gray-500 text-gray-500'>
        <div className='ml-4 mr-4 border-t-8'></div>
        <div className='ml-4 mr-4 border-t-8'></div>
        <div className='flex'>
          <h1 className='ml-6 mt-3 text-3xl uppercase'>{weekday}</h1>
          <h3 className='font-heavy ml-6 mt-3 text-lg font-thin'>
            {formattedDate}
          </h3>
        </div>
        <p className='ml-6 mt-1 text-lg'>Top trends, served fresh daily.</p>
      </div>
      {mockData
        .sort((a, b) => b.significance - a.significance)
        .map((card, index) => {
          return (
            <div key={index} className='w-[calc(33.333%-1rem)]'>
              {card.type === 'tweet' ? (
                <HotTweet
                  id={card.id}
                  label={card.label}
                  time={card.time}
                  retweet={card.retweet}
                  reply={card.reply}
                  like={card.like}
                  bookmark={card.bookmark}
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
