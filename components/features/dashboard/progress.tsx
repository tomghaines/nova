import { Progress } from '@/components/ui/progress';

export const ProgressBar = ({ progress }) => {
  return (
    <div className='flex h-[400px] w-[800px] items-center justify-center border border-gray-200'>
      <div className='w-[200px]'>
        <Progress value={progress} />
      </div>
    </div>
  );
};
