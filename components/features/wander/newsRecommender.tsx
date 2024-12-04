import React, { useState, useEffect } from 'react';

interface NewsRecommenderProps {
  initialContent: string;
}

const NewsRecommender: React.FC<NewsRecommenderProps> = ({
  initialContent
}) => {
  return (
    <div>
      <h1>News Recommender</h1>
      <p>{initialContent}</p>
    </div>
  );
};

export default NewsRecommender;
