'use client';

import { signInWithTwitterAction } from '@/app/actions';
import { FaTwitter } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export function TwitterSignIn() {
  return (
    <Button
      onClick={() => signInWithTwitterAction()}
      type='button'
      className='w-full'
      variant='default'
    >
      <FaTwitter />
      Sign In with Twitter
    </Button>
  );
}
