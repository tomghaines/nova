import React from 'react';
import SentimentChart from '../../seek/sentimentChart';
// import MindshareMap from '@/components/features/seek/mindshareMap';

interface MailContentProps {
  username: string;
  summary: string;
}

export const MailContent: React.FC<MailContentProps> = ({ username, summary }) => {
  const username = '';
  const summary = '';

  return (
    <div>
      {/* Heading */}
      <h1>Birdy Newsletter: The Latest in Web3 Trends</h1>
      <p>Hello ${username},</p>
      <p>
        Here's your weekly dose of insights and trends happening in the Web3
        world. Stay updated with the latest market shifts and narratives
        dominating the space.
      </p>

      {/* Summary */}
      <h2>Trending This Week</h2>
      <p>${summary}</p>

      {/* Seek */}
      <h2>🎭 Sentiment</h2>
      <SentimentChart />

      {/* <h2>👁️ Mindshare</h2>
      <MindshareMap />

      {/* Wander */}
      {/* <h2>🔍 Discussions</h2>
      <p></p> */}

      {/* Footer */}
      <a
        href='https://localhost:3000/home'
        style={{
          backgroundColor: '#625B71',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Read the Full Analysis
      </a>
      <p>
        Happy trading,
        <br />
        The birdy.ai Team
      </p>
    </div>
  );
};

export default MailContent;
