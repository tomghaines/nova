import { supabase } from '@/utils/supabase';
import { SentimentData } from '../types/data/SentimentData.types';

export default async function fetchSentimentData() {
  try {
    const { data, error } = await supabase.from('sentiment_table').select('*');
    if (error) throw error;
    return data as SentimentData[];
  } catch (err) {
    console.error('Error fetching sentimend data:', err);
    return [];
  }
}
