import React, { useState, useEffect } from 'react';

interface NewsRecommenderProps {
  initialContent: string;
}

const NewsRecommender: React.FC<NewsRecommenderProps> = ({
  initialContent
}) => {
  return (
    <div>
      <p>{initialContent}</p>
    </div>
  );
};

export default NewsRecommender;
