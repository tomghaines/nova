'use client';
import React, { useState } from 'react';
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
  const [showRecommender, setShowRecommender] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string>('');
  const card = mockData.find((item) => item.id === id && item.type === 'tweet');
  const link = card?.link;

  const handleContentAnalysisClick = async () => {
    setShowRecommender(true);
    try {
      const response = await fetch('/api/wander', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newsContent: content })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        console.error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleCloseRecommender = () => {
    setShowRecommender(false);
  };

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
        <div className='flex justify-between text-left'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            <Button
              variant='link'
              className='mt-3 p-1 text-xs text-gray-600 dark:text-neutral-400'
            >
              See Original
            </Button>
          </a>
          <Button
            className='mb-2 mt-3 h-8 border bg-gray-400 p-4 text-xs dark:bg-neutral-700 dark:text-neutral-300'
            onClick={handleContentAnalysisClick}
          >
            Content Analysis
          </Button>
        </div>
      </div>

      {/* Popup for News Recommender */}
      {showRecommender && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-3/4 max-w-2xl rounded-lg bg-neutral-200 p-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>Content Analysis</h2>
              <button onClick={handleCloseRecommender} className=''>
                Close
              </button>
            </div>
            <div>
              {recommendations ? (
                <div>
                  <h2>Recommended Readings:</h2>
                  <p>{recommendations}</p>
                </div>
              ) : (
                <p>Loading recommendations...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotTweet;
