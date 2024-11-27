import { supabase } from '@/utils/supabase';
import { MindshareData } from '../types/data/MindshareData.types';

export default async function fetchMindshareData() {
  try {
    const { data, error } = await supabase.from('mindshare_table').select('*');
    if (error) throw error;
    return data as MindshareData[];
  } catch (err) {
    console.error('Error fetching mindshare data:', err);
    return [];
  }
}
