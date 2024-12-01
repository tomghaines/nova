import { createClient, SupabaseClient } from '@supabase/supabase-js';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Subscriber } from '@/@types/data/SubscriberData';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
});

// Function to add a subscriber
async function addSubscriber(email: string): Promise<void> {
  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: email,
      status: 'subscribed',
    });
    console.log('Subscriber added successfully');
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

// Function to get site data from Supabase
async function getSiteData(): Promise<SiteData> {
  const { data, error } = await supabase
    .from('site_data')
    .select('*')
    .single();

  if (error) throw error;
  return data as SiteData;
}

// Function to generate content using AI API
async function generateAIContent(siteData: SiteData): Promise<string> {
  try {
    const response = await axios.post('YOUR_AI_API_ENDPOINT', {
      chartData: siteData.chartData,
      // Add any other relevant data
    });
    return response.data.generatedContent;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
}

// Function to create and send weekly newsletter
async function sendWeeklyNewsletter(): Promise<void> {
  try {
    const siteData = await getSiteData();
    const aiContent = await generateAIContent(siteData);

    // Create campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: process.env.MAILCHIMP_LIST_ID! },
      settings: {
        subject_line: 'Your Weekly Newsletter',
        from_name: 'Your Company',
        reply_to: 'noreply@yourcompany.com',
      },
    });

    // Set campaign content
    await mailchimp.campaigns.setContent(campaign.id, {
      html: `
        <h1>Weekly Newsletter</h1>
        <p>${aiContent}</p>
        <!-- Add more HTML content here, potentially including chart data -->
      `,
    });

    // Send the campaign
    await mailchimp.campaigns.send(campaign.id);

    console.log('Weekly newsletter sent successfully');
  } catch (error) {
    console.error('Error sending weekly newsletter:', error);
    throw error;
  }
}

// API route handler for newsletter signup
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      await addSubscriber(email);
      res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to subscribe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// You would need to set up a cron job or use a service like Vercel Cron
// to trigger this function weekly
// Example cron syntax for weekly Sunday at 1 AM: 0 1 * * 0
export async function weeklyNewsletterCron(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await sendWeeklyNewsletter();
    res.status(200).json({ message: 'Weekly newsletter sent successfully' });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ error: 'Failed to send weekly newsletter' });
  }
}