import React from 'react';

interface MailContentProps {
  summary: string;
}

export const MailContent: React.FC<MailContentProps> = ({ summary }) => {

  return (
    <div>
      {/* Heading */}
      <h1>birdy.ai Newsletter: The Latest in Web3 Trends</h1>
      <p>Hello,</p >
      <p>
        Here's your weekly dose of insights and trends happening in the Web3
        world. Stay updated with the latest market shifts and narratives
        dominating the space.
      </p>

      {/* Summary */}
      <h2>🔥 Trending This Week</h2>
      <p>{summary}</p>

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
