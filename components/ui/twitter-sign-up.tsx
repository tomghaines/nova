'use client';

import { signUpWithTwitterAction } from '@/app/actions';
import { FaTwitter } from 'react-icons/fa';

export function TwitterSignUp() {
  return (
    <button
      onClick={() => signUpWithTwitterAction()}
      type='button'
      className='w-full py-2 px-4 bg-gray-900 text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-700'
    >
      <FaTwitter />
      Sign up with Twitter
    </button>
  );
}
