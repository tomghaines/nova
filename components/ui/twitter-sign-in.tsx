'use client';

import { signInWithTwitterAction } from '@/app/actions';
import { FaTwitter } from 'react-icons/fa';

export function TwitterSignIn() {
  return (
    <button
      onClick={() => signInWithTwitterAction()}
      type='button'
      className='flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700'
    >
      <FaTwitter />
      Sign In with Twitter
    </button>
  );
}
