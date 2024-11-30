export type Card =
  | {
      type: 'tweet';
      label: string;
      title: string;
      content: string;
      significance: number;
    }
  | { type: 'narrative'; label: string; significance: number };

export const mockData: Card[] = [
  {
    type: 'tweet',
    label: 'SOL',
    title: 'Anatoly Yakovenko',
    content:
      'As blockchain evolves, Solana continues to push boundaries, focusing on low-cost transactions and high throughput. The future is decentralized, and Solana is leading the way.',
    significance: 10
  },
  { type: 'narrative', label: '#HALVING', significance: 7 },
  {
    type: 'tweet',
    label: 'BTC',
    title: 'Michael Saylor',
    content:
      '#Bitcoin is a swarm of cyber hornets serving the goddess of wisdom, feeding on the fire of truth, exponentially growing ever smarter, faster, and stronger behind a wall of encrypted energy.',
    significance: 3
  },
  {
    type: 'tweet',
    label: 'Regulation',
    title: 'Balaji',
    content:
      'If only Elizabeth Warren knew that companies were getting unbanked by her friends at the Fed…if only she knew about Operation Chokepoint 2.0, which she personally helped organize…no doubt she would have sent her pets at CFPB to the rescue.',
    significance: 5
  },
  { type: 'narrative', label: '#STABLECOIN', significance: 6 },
  {
    type: 'tweet',
    label: 'DAO Hack',
    title: 'Laura Shin',
    content:
      "EXCLUSIVE: With the publication of my book today, I can finally announce: in the course of writing my book, my sources and I believe we uncovered the identity of the Ethereum's 2016 DAO hacker.",
    significance: 8
  },
  { type: 'narrative', label: '#REGULATION', significance: 4 },
  {
    type: 'tweet',
    label: 'L2',
    title: 'vitalik.eth',
    content:
      'One part of L2 scaling is Ethereum increasing its blob capacity. The other part is rollups becoming more data-efficient. Good to see @Starknet rising to the challenge.',
    significance: 6
  },
  { type: 'narrative', label: '#BULLTRAP', significance: 2 },
  {
    type: 'tweet',
    label: 'Meme',
    title: 'CZ 🔶 BNB',
    content:
      "I am not against memes, but meme coins are getting a little weird now. Let's build real applications using blockchain.",
    significance: 4
  },
  { type: 'narrative', label: '#TRADING', significance: 7 },
  { type: 'narrative', label: '#LONGDOGE', significance: 4 }
];
