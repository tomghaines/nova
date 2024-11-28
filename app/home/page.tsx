import { Button } from '@/components/ui/button';
import ParticleSystem from '@/components/home/particle';

export default function Home() {
  return (
    <div className='flex h-screen w-full items-center'>
      <div className='absolute left-24 -translate-y-16 transform'>
        <p className='mb-6 w-1/5 rounded-lg border border-black text-center text-gray-600'>
          Dashboard
        </p>
        <h1 className='mb-4 text-3xl text-5xl leading-tight'>
          Your Real-time Lens into <br />
          Web3 Trends.
        </h1>
        <p className='mb-8 text-base font-thin leading-relaxed'>
          An AI-powered dashboard platform that real-time tracks <br />
          trending web3 topics on X Platform, providing insightful <br />
          analysis and interactive data visualizations <br />
        </p>
        <Button className='w-full'>Enter</Button>
      </div>

      <img
        src='bg-blue.png'
        className='absolute left-0 top-0 -z-10 h-full w-full object-cover'
        alt='Background'
      />
      <ParticleSystem />
    </div>
  );
}
