import { supabase } from '@/utils/supabase';

export default async function fetchSentimentData() {
  try {
    const { data, error } = await supabase.from('sentiment_table').select('*');
    if (error) throw error;
    return data.map((item) => ({
      id: item.id,
      sentimentValue: item.sentiment_value,
      date: item.date,
      price: item.price,
      analysis: item.analysis
    }));
  } catch (err) {
    console.error('Error fetching sentimend data:', err);
    return [];
  }
}
