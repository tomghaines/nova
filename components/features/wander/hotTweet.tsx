import React from 'react';
import { Button } from '@/components/ui/button';
import { mockData } from './weeklyData';

interface CardProps {
  id: number;
  retweet: number;
  reply: number;
  like: number;
  bookmark: number;
  time: string;
  label: string;
  title: string;
  content: string;
}

const HotTweet: React.FC<CardProps> = ({
  id,
  label,
  retweet,
  reply,
  like,
  bookmark,
  time,
  title,
  content
}) => {
  const card = mockData.find((item) => item.id === id && item.type === 'tweet');
  const link = card?.link;
  return (
    <div className='h-auto w-auto p-4'>
      {/* Card */}
      <div className='h-auto w-full rounded-3xl border border-gray-300 bg-gray-200 p-6 text-gray-600 duration-700 hover:scale-105 dark:border-neutral-600 dark:bg-neutral-800'>
        {/* Label */}
        <div className='flex justify-between'>
          <div className='mb-4 inline-block w-auto rounded-xl border border-black p-1 text-sm dark:invert'>
            <span className='ml-2 mr-2'>{label}</span>
          </div>
          <div className='text-xs dark:invert'>
            <span className='ml-2 mr-2'>{time}</span>
          </div>
        </div>
        {/* Stats */}
        <div className='mb-2 flex flex-col'>
          <div className='inline-block w-auto rounded-xl p-1 text-xs dark:invert'>
            <span>Retweet: {retweet}</span>
          </div>
          <div className='inline-block w-auto rounded-xl p-1 text-xs dark:invert'>
            <span>Reply: {reply}</span>
          </div>
          <div className='inline-block w-auto rounded-xl p-1 text-xs dark:invert'>
            <span>Like: {like}</span>
          </div>
          <div className='inline-block w-auto rounded-xl p-1 text-xs dark:invert'>
            <span>Bookmark: {bookmark}</span>
          </div>
        </div>
        {/* Content */}
        <h1 className='mb-2 text-xl font-semibold dark:text-neutral-400'>
          {title}
        </h1>
        <p className='text-sm font-thin dark:text-white'>{content}</p>
        {/* Button */}
        <div className='w-full text-right'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            <Button variant='link' className='mt-4 text-2xl text-gray-600'>
              ▶▶▶
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotTweet;
