import { sendWeeklyNewsletter } from "./controller";

(async () => {
  try {
    console.log('Starting the test...');
    await sendWeeklyNewsletter();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
})();