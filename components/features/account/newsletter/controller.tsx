import { createClient, SupabaseClient } from '@supabase/supabase-js';
import mailchimp from './mailchimpSetup';
import { MailContent } from './mailContent';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

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

// Function to create a weekly newsletter campaign
export async function createWeeklyNewsletter(): Promise<string> {
  try {
    const mailContentHtml = renderToStaticMarkup(<MailContent />);

    // Create Mailchimp campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: process.env.MAILCHIMP_LIST_ID! },
      settings: {
        subject_line: 'Birdy Newsletter: The Latest in Web3 Trends',
        from_name: 'birdy.ai',
        reply_to: 'noreply@birdy.ai'
      }
    });

    // Set campaign content
    await mailchimp.campaigns.setContent(campaign.id, {
      html: mailContentHtml,
    });

    console.log('Weekly newsletter created successfully');
    return campaign.id;
  } catch (error) {
    console.error('Error creating weekly newsletter:', error);
    throw error;
  }
}

// Function to send the weekly newsletter campaign
export async function sendWeeklyNewsletter(campaignId: string): Promise<void> {
  try {
    const campaignId = await createWeeklyNewsletter();
    await mailchimp.campaigns.send(campaignId);
    console.log('Weekly newsletter sent successfully');
  } catch (error) {
    console.error('Error sending weekly newsletter:', error);
    throw error;
  }
}


