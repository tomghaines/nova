import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-4xl font-bold'>404</h1>
      <h2 className='mb-8 text-xl'>Page Not Found</h2>
      <p className='mb-8 text-gray-600 dark:text-gray-400'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href='/home'
        className='rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
      >
        Go to Home
      </Link>
    </main>
  );
}
