import React from 'react';
import HotTweet from '@/components/features/wander/hotTweet';
import HotNarrative from '@/components/features/wander/hotNarrative';

export default function Page() {
  type Card =
    | { type: 'tweet'; label: string; title: string; content: string }
    | { type: 'narrative'; label: string };

  const mockData1: Card[] = [
    {
      type: 'tweet',
      label: 'L2',
      title: 'vitalik.eth',
      content:
        'One part of L2 scaling is Ethereum increasing its blob capacity. The other part is rollups becoming more data-efficient. Good to see @Starknet rising to the challenge.'
    },
    {
      type: 'tweet',
      label: 'Regulation',
      title: 'Balaji',
      content:
        'If only Elizabeth Warren knew that companies were getting unbanked by her friends at the Fed…if only she knew about Operation Chokepoint 2.0, which she personally helped organize…no doubt she would have sent her pets at CFPB to the rescue.'
    },
    {
      type: 'tweet',
      label: 'SOL',
      title: 'Anatoly Yakovenko',
      content:
        'As blockchain evolves, Solana continues to push boundaries, focusing on low-cost transactions and high throughput. The future is decentralized, and Solana is leading the way.'
    },
    {
      type: 'tweet',
      label: 'BTC',
      title: 'Michael Saylor',
      content:
        '#Bitcoin is a swarm of cyber hornets serving the goddess of wisdom, feeding on the fire of truth, exponentially growing ever smarter, faster, and stronger behind a wall of encrypted energy.'
    },
    {
      type: 'tweet',
      label: 'Meme',
      title: 'CZ 🔶 BNB',
      content:
        "I am not against memes, but meme coins are getting a little weird now. Let's build real applications using blockchain."
    },
    {
      type: 'tweet',
      label: 'DAO Hack',
      title: 'Laura Shin',
      content:
        "EXCLUSIVE: With the publication of my book today, I can finally announce: in the course of writing my book, my sources and I believe we uncovered the identity of the Ethereum's 2016 DAO hacker."
    }
  ];

  const mockData2: Card[] = [
    {
      type: 'narrative',
      label: '#TRADING'
    },
    {
      type: 'narrative',
      label: '#BULLTRAP'
    },
    {
      type: 'narrative',
      label: '#REGULATION'
    },
    {
      type: 'narrative',
      label: '#STABLECOIN'
    },
    {
      type: 'narrative',
      label: '#HALVINGCIRCLE'
    }
  ];

  const combinedData = [];
  const maxLength = Math.max(mockData1.length, mockData2.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < mockData1.length) {
      combinedData.push(mockData1[i]);
    }
    if (i < mockData2.length) {
      combinedData.push(mockData2[i]);
    }
  }

  return (
    <div className='mt-8 flex h-[1000px] flex-col flex-wrap gap-6 p-6'>
      {combinedData.map((card, index) => (
        <div key={index} className='w-[calc(33.333%-1rem)]'>
          {card.type === 'tweet' ? (
            <HotTweet
              label={card.label}
              title={card.title}
              content={card.content}
            />
          ) : (
            <HotNarrative label={card.label} />
          )}
        </div>
      ))}
    </div>
  );
}
