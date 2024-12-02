import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'>
      <motion.div
        className='h-16 w-16 rounded-full border-b-2 border-r-2 border-emerald-400'
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
