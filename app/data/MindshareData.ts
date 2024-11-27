import { supabase } from '@/utils/supabase';

interface MindshareData {
  id: number;
  name: string;
  date: string;
  percentage: number;
}

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
