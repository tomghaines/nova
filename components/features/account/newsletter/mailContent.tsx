import React, { useState, useEffect } from 'react';

interface MailContentProps {
  username: string;
  summary: string;
}

export const MailContent: React.FC = () => {
  const [username, setUsername] = useState<string>('User');
  const [summary, setSummary] = useState<string>('Loading summary...');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            keywords: 'Web3 weekly trends'
          })
        });

        if (response.ok) {
          const data = await response.json();
          setSummary(data.summary || 'No summary available');
        } else {
          setSummary('Failed to load summary. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
        setSummary('An error occurred while fetching the summary.');
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      {/* Heading */}
      <h1>birdy.ai Newsletter: The Latest in Web3 Trends</h1>
      <p>Hello {username},</p >
      <p>
        Here's your weekly dose of insights and trends happening in the Web3
        world. Stay updated with the latest market shifts and narratives
        dominating the space.
      </p >

      {/* Summary */}
      <h2>🔥 Trending This Week</h2>
      <p>{summary}</p >

      {/* Footer */}
      <a
        href=' '
        style={{
          backgroundColor: '#625B71',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Read the Full Analysis
      </a >
      <p>
        Happy trading,
        <br />
        The birdy.ai Team
      </p >
    </div>
  );
};

export default MailContent;