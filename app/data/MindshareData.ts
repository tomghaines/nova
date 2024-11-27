import { supabase } from '@/utils/supabase';

export default async function fetchMindshareData() {
  try {
    const { data, error } = await supabase.from('mindshare_table').select('*');
    if (error) throw error;
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      date: item.date,
      percentage: item.percentage
    }));
  } catch (err) {
    console.error('Error fetching mindshare data:', err);
    return [];
  }
}
