import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonBar = () => {
  return (
    <div className='flex h-[400px] w-[800px] items-center justify-center border border-gray-200'>
      <SkeletonTheme customHighlightBackground='linear-gradient(90deg, #ebebeb 30%, #36454F 60%, #ebebeb 50%)'>
        <Skeleton width={300} style={{ marginLeft: '60px' }} />
      </SkeletonTheme>
    </div>
  );
};
