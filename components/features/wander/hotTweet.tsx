import React from 'react';
import { Button } from '@/components/ui/button';

interface CardProps {
  label: string;
  title: string;
  content: string;
}

const HotTweet: React.FC<CardProps> = ({ label, title, content }) => {
  return (
    <div className='h-auto w-auto p-4'>
      {/* Card */}
      <div className='h-auto w-full rounded-3xl border border-gray-300 bg-gray-200 p-6 text-gray-600 duration-700 hover:scale-105 dark:border-neutral-600 dark:bg-neutral-800'>
        {/* Label */}
        <div className='mb-4 inline-block w-auto rounded-xl border border-black p-1 dark:invert'>
          <span className='ml-2 mr-2'>{label}</span>
        </div>
        {/* Content */}
        <h1 className='mb-2 text-2xl font-semibold dark:text-neutral-400'>
          {title}
        </h1>
        <p className='text-md font-thin dark:text-white'>{content}</p>
        {/* Button */}
        <div className='w-full text-right'>
          <Button variant='link' className='mt-4 text-2xl text-gray-600'>
            ▶▶▶
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotTweet;
