import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!
});

console.log('Mailchimp configuration:', {
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

export default mailchimp;
