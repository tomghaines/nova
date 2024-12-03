import React from 'react';
import { SubmitButton } from '@/components/ui/submit-button';
import { TwitterSignUp } from '@/components/ui/twitter-sign-up';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, Message } from '@/components/form-message';
import { signUpAction } from '@/app/actions';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ('message' in searchParams) {
    return (
      <div className='flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md'>
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h1 className='text-2xl font-semibold text-gray-800'>Create Account</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Sign up today and unlock a world of possibilities. Your adventure
          begins here.
        </p>

        <div className='mt-4'>
          {/* Twitter SSO */}
          <TwitterSignUp />
        </div>

        <div className='mt-6 flex items-center justify-center'>
          <div className='w-full border-t border-gray-300'></div>
          <span className='mx-4 text-sm text-gray-500'>OR</span>
          <div className='w-full border-t border-gray-300'></div>
        </div>

        <form className='mt-6'>
          {/* Username Input */}
          <div className='mb-4'>
            <Label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </Label>
            <Input
              type='text'
              id='username'
              placeholder='Your username'
              className='focus:ring-grey-500 focus:border-grey-500 mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm sm:text-sm'
              required
            />
          </div>

          {/* Email Input */}
          <div className='mb-4'>
            <Label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </Label>
            <Input type='email' id='email' placeholder='Enter email' required />
          </div>

          {/* Password Input */}
          <div className='mb-4'>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              id='password'
              placeholder='Create a password'
              minLength={6}
              required
            />
          </div>

          {/* Submit Button */}
          <SubmitButton formAction={signUpAction} pendingText='Signing up...'>
            Create Account
          </SubmitButton>
        </form>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <a href='/sign-in' className='text-blue-600 hover:underline'>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
