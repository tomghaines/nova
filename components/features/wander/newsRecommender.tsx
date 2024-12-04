import React, { useState } from 'react';

const NewsRecommender: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewsContent(e.target.value);
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newsContent })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        console.error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>News Recommender</h1>
      <textarea
        placeholder='Enter news content here...'
        value={newsContent}
        onChange={handleInputChange}
        rows={6}
        cols={50}
      />
      <br />
      <button onClick={handleGetRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>
      <div>
        {recommendations && (
          <div>
            <h2>Recommended Readings:</h2>
            <p>{recommendations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsRecommender;
