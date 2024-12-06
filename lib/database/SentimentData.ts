// import supabase from '@/utils/supabase/client';

// export default async function fetchSentimentData() {
//   try {
//     const { data, error } = await supabase.from('sentiment_table').select('*');
//     if (error) throw error;
//     return data.map((item) => ({
//       id: item.id,
//       sentimentValue: item.sentiment_value,
//       date: item.date,
//       price: item.price,
//       analysis: item.analysis
//     }));
//   } catch (err) {
//     console.error('Error fetching sentiment data:', err);
//     return [];
//   }
// }

import supabase from '@/utils/supabase/client';

export default async function fetchSentimentData(coin) {
  try {
    // Fetch overall coin data
    const coinData = await fetchCoinData(coin);
    if (!coinData) throw new Error(`No data found for coin ${coin}`);
    // Fetch key points
    const keyPoints = await fetchKeyPoints(coinData.id);
    // Fetch weekly sentiment
    const weeklySentiment = await fetchWeeklySentiment(coinData.id);
    // Fetch top tweets for each weekly sentiment entry
    const weeklySemtimentWithTweets = await Promise.all(
      weeklySentiment.map(async (entry) => {
        const tweets = await fetchTopTweets(entry.id);
        return { ...entry, tweets };
      })
    );

    return {
      coinData,
      keyPoints,
      weeklySentiment: weeklySemtimentWithTweets
    };
  } catch (err) {
    console.error(`Error fetching sentiment data for ${coin}:`, err);

    return null;
  }
}

export async function fetchCoinData(coin) {
  try {
    const { data, error } = await supabase
      .from('coins')
      .select('*')
      .eq('symbol', coin.toUpperCase());

    if (error) throw error;

    return data[0]; // Expecting a single coin match
  } catch (err) {
    console.error(`Error fetching data for coin ${coin}:`, err);

    return null;
  }
}

export async function fetchKeyPoints(coinId) {
  try {
    const { data, error } = await supabase
      .from('key_points')
      .select('type, point')
      .eq('coin_id', coinId);

    if (error) throw error;

    return data; // Array of key points
  } catch (err) {
    console.error(`Error fetching key points for coin ID ${coinId}:`, err);
    return [];
  }
}

export async function fetchWeeklySentiment(coinId) {
  try {
    const { data, error } = await supabase
      .from('weekly_sentiment')
      .select('*')
      .eq('coin_id', coinId)
      .order('date_range', { ascending: false }); // Fetch latest first

    if (error) throw error;

    return data;
  } catch (err) {
    console.error(
      `Error fetching weekly sentiment for coin ID ${coinId}:`,
      err
    );
    return [];
  }
}

export async function fetchTopTweets(weeklySentimentId: any) {
  try {
    const { data, error } = await supabase
      .from('top_tweets')
      .select('*')
      .eq('weekly_sentiment_id', weeklySentimentId);

    if (error) throw error;

    return data; // Array of tweets
  } catch (err) {
    console.error(
      `Error fetching top tweets for weekly sentiment ID ${weeklySentimentId}:`,
      err
    );

    return [];
  }
}
