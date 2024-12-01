import React from 'react';
import { Button } from '@/components/ui/button';

interface CardProps {
  label: string;
  title: string;
  content: string;
  backgroundColor: string;
}

const HotTweet: React.FC<CardProps> = ({
  label,
  title,
  content,
  backgroundColor
}) => {
  return (
    <div className='h-auto w-auto p-4'>
      {/* Card */}
      <div
        className='h-auto w-full rounded-3xl p-6 duration-700 hover:scale-105 hover:brightness-90'
        style={{ backgroundColor }}
      >
        {/* Label */}
        <div className='mb-4 inline-block w-auto rounded-xl border p-1'>
          <span className='ml-2 mr-2 invert'>{label}</span>
        </div>
        {/* Content */}
        <h1 className='mb-2 text-2xl font-bold invert'>{title}</h1>
        <p className='text-md font-thin invert'>{content}</p>
        {/* Button */}
        <div className='w-full text-right'>
          <Button variant='link' className='mt-4 text-2xl invert'>
            ▶▶▶
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotTweet;
