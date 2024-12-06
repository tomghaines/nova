import supabase from '@/utils/supabase/client';

export default async function fetchMindshareData() {
  try {
    const { data, error } = await supabase
      .from('mindshare_table')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      date: item.date,
      percentage: item.percentage,
      coin_symbol: item.name // Using the name field as coin_symbol
    }));
  } catch (err) {
    console.error('Error fetching mindshare data:', err);
    return [];
  }
}
