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
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ newsContent: content })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        console.error('Failed to fetch recommendations', response.status);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleCloseRecommender = () => {
    setShowRecommender(false);
  };

  const formatRecommendations = (text: string) => {
    return text
      .split(/(?=\d+\.\s\*\*)|(?=###)/) // Split at numbered points followed by ** or ###
      .map((part, index) => {
        if (part.startsWith('###')) {
          return (
            <h2 key={index} className='mb-2 mt-4 text-lg font-bold'>
              {part.replace('###', '').trim()}
            </h2>
          );
        }
        return (
          <p key={index} className='mb-4'>
            {part.split(/(\*\*.*?\*\*)/).map((subPart, subIndex) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return (
                  <strong key={subIndex} className='font-bold'>
                    {subPart.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              return subPart;
            })}
          </p>
        );
      });
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
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50'>
          <div className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-neutral-300 p-12 text-sm dark:text-neutral-600'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-3xl font-bold'>Content Analysis</h2>
              <button onClick={handleCloseRecommender} className=''>
                Close
              </button>
            </div>
            <hr className='mb-4 border-gray-400' />
            <div className='formatted-recommendations'>
              {recommendations ? (
                formatRecommendations(recommendations)
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
