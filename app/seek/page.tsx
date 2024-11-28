import { SentimentChart } from '@/components/dashboard/sentimentChart';
import { MindshareMap } from '@/components/dashboard/mindshareMap';
import { CommandDemo } from '@/components/dashboard/command';

export default function page () {
  return (
    <div className='flex w-full flex-col items-center justify-start'>
      {/* Inner Container for Charts and Search */}
      <div className='w-[90%] max-w-5xl px-6 pl-[100px] text-center'>
        {/* Search Bar */}
        <div className='mb-8'>
          <CommandDemo />
        </div>

        {/* Sentiment Chart Section */}
        <div className='mb-16'>
          <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Sentiment Analysis
          </h1>
          <p className='mb-6 text-gray-600 dark:text-gray-400'>
            The use of natural language processing, text analysis,
            computational linguistics based on X (formerly Twitter)
            to systematically study the market behaviors.
          </p>
          <SentimentChart />
        </div>

        {/* Mindshare Map Section */}
        <div>
          <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Mindshare Map
          </h1>
          <p className='mb-6 text-gray-600 dark:text-gray-400'>
            A systematic representation of how the collective
            attention on X shifts across critical concepts, aiding
            in understanding market trends and focus distribution.
          </p>
          <MindshareMap />
        </div>
      </div>
    </div>
  )
}