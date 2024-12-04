'use client';

import { signUpWithTwitterAction } from '@/app/actions';
import { FaTwitter } from 'react-icons/fa';

export function TwitterSignUp() {
  return (
    <button
      onClick={() => signUpWithTwitterAction()}
      type='button'
      className='flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-700'
    >
      <FaTwitter />
      Sign up with Twitter
    </button>
  );
}
