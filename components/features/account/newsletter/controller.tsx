import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import React from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import mailchimp from './mailchimpSetup';
import { MailContent } from './mailContent';
import { renderToStaticMarkup } from 'react-dom/server';
import cron from 'node-cron';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required.');
}

// Function to add a new subscriber to Supabase and Mailchimp
export async function addSubscriber(email: string): Promise<void> {
  try {
    // Add to Supabase
    console.log('Adding subscriber to Supabase');
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) throw error;

    // Add to Mailchimp
    console.log('Adding subscriber to Mailchimp');
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: email,
      status: 'subscribed'
    });

    console.log('Subscriber added successfully to Supabase and Mailchimp');
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

async function fetchSummary(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: 'Web3 weekly trends',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.text();
      return data;
    } else {
      console.error('Failed to fetch summary:', response.statusText);
      return 'Failed to load summary. Please try again later.';
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Fetch request timed out');
      return 'The request took too long and was aborted.';
    } else {
      console.error('Error fetching summary:', error);
      return 'An error occurred while fetching the summary.';
    }
  }
}

// Function to format the summary for HTML
function formatSummary(summary: string): string {
  return summary
    .replace(/^###\s+/gm, '<h2>')       // Replace '### ' with an HTML <h2> tag
    .replace(/####\s+/gm, '<h3>')        // Replace '#### ' with an HTML <h3> tag
    .replace(/-\s+/g, '<li>')            // Replace '- ' with an HTML list item tag <li>
    .replace(/(\*\*)(.+?)(\*\*)/g, '<b>$2</b>'); // Replace '** **' with bold <b> tag
}

// Function to create a weekly newsletter campaign
export async function createWeeklyNewsletter(): Promise<string> {
  try {
    /* const summary = await fetchSummary(); 
    const formattedSummary = formatSummary(summary); */
    const mailContentHtml = renderToStaticMarkup(<MailContent summary='test'/* { formattedSummary } */ />);

    // Create Mailchimp campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: process.env.MAILCHIMP_LIST_ID! },
      settings: {
        subject_line: 'Birdy Newsletter: The Latest in Web3 Trends',
        from_name: 'birdy.ai',
        reply_to: 'melzhou1204@gmail.com'
      }
    });

    // Set campaign content
    await mailchimp.campaigns.setContent(campaign.id, {
      html: mailContentHtml
    });

    console.log('Weekly newsletter created successfully');
    return campaign.id;
  } catch (error) {
    console.error('Error creating weekly newsletter:', error);
    throw error;
  }
}

// Function to send the weekly newsletter campaign
export async function sendWeeklyNewsletter(): Promise<void> {
  try {
    const campaignId = await createWeeklyNewsletter();
    await mailchimp.campaigns.send(campaignId);
    console.log('Weekly newsletter sent successfully');
  } catch (error) {
    console.error('Error sending weekly newsletter:', error);
    throw error;
  }
}

// Schedule the function to run every Mondy at 9 AM
cron.schedule('0 9 * * 1', () => {
  console.log('Running weekly newsletter job...');
  sendWeeklyNewsletter();
});
