import * as mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

export default mailchimp;
