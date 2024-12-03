export type Card =
  | {
      id: number;
      type: 'tweet';
      label: string;
      title: string;
      content: string;
      significance: number;
      link: string;
    }
  | {
      type: 'narrative';
      id: number;
      label: string;
      significance: number;
      link: string;
    };

export const mockData: Card[] = [
  {
    id: 1,
    type: 'tweet',
    label: 'Wallet',
    title: 'Vitalik Buterin',
    content: 'What I would love to see in a wallet: https://t.co/51zWXRVKrE',
    significance: 9,
    link: 'https://x.com/VitalikButerin/status/1863901050819788912'
  },
  {
    id: 1,
    type: 'narrative',
    label: '#XRP',
    significance: 8,
    link: 'null'
  },
  {
    id: 2,
    type: 'tweet',
    label: 'BTC Investment',
    title: 'Michael Saylor',
    content:
      'MicroStrategy has acquired 15,400 BTC for ~$1.5 billion at ~$95,976 per #bitcoin and has achieved BTC Yield of 38.7% QTD and 63.3% YTD. As of 12/2/2024, we hodl 402,100 $BTC acquired for ~$23.4 billion at ~$58,263 per bitcoin. $MSTR',
    significance: 10,
    link: 'https://x.com/saylor/status/1863569873713955156'
  },
  {
    id: 2,
    type: 'narrative',
    label: '#SouthKorea',
    significance: 9,
    link: 'null'
  },
  {
    id: 3,
    type: 'tweet',
    label: 'Debanking',
    title: 'Balaji',
    content:
      'Debanking is happening. And it’s bad that it is. Remember that Warren built an anti-crypto army. So of course she was willing to unbank companies! Her goal was to block you from escaping control. And she almost succeeded, if not for democracy. @nic__carter has the details.',
    significance: 2,
    link: 'https://x.com/balajis/status/1862899411413774443'
  },
  {
    id: 3,
    type: 'narrative',
    label: '#2024withBinance',
    significance: 5,
    link: 'null'
  },
  {
    id: 4,
    type: 'tweet',
    label: 'Market',
    title: 'Ashcryptoreal',
    content:
      'THE BULLRUN IS JUST STARTING. THIS IS A REMINDER THAT THE BULLRUN IS FAR FROM OVER. HISTORICALLY, BITCOIN MOVES IN A RANGE AND THE BULLRUN IS 1001 DAYS FROM BOTTOM TO PEAK. IF THE SAME TIMEFRAME KICKS IN, WE CAN EXPECT THE NEXT ATH IN 287 DAYS (WEEK 4 OF SEP 2025). AFTER THAT, WE CAN EXPECT 406 DAYS OF CONTINUOUS SELLING.',
    significance: 7,
    link: 'https://x.com/Ashcryptoreal/status/1863890777371209887'
  },
  {
    id: 4,
    type: 'narrative',
    label: '#TEZOSTUESDAY',
    significance: 8,
    link: 'null'
  },
  {
    id: 5,
    type: 'tweet',
    label: 'ETF',
    title: 'RyanSAdams',
    content:
      'Ethereum ETF daily inflows exceeded bitcoin ETF for the first time ever. $332m in Ethereum ETF inflows yesterday. TradFi woke up and realized ETH under $4k is the black friday deal of the decade. We are going higher. 🚀',
    significance: 3,
    link: 'https://x.com/RyanSAdams/status/1862871382511464755'
  },
  {
    id: 5,
    type: 'narrative',
    label: '#TRX',
    significance: 6,
    link: 'null'
  }
];
