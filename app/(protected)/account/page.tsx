'use client';

import { useState } from 'react';
import { SubmitButton } from '@/components/ui/submit-button';
import { TwitterSignUp } from '@/components/ui/twitter-sign-up';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpAction } from '@/app/actions';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    try {
      const message = await signUpAction(formData);
      setMessage(message);
      setIsSuccess(message.startsWith('Thanks for signing up'));
    } catch (err) {
      const error = err as Error;
      setMessage(error.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className='mt-100 flex min-h-screen items-center justify-center bg-gray-50'>
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

        <form className='mt-6' onSubmit={handleSubmit}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <Input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter email'
              required
            />
          </div>

          {/* Password Input */}
          <div className='mb-4'>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </Label>
            <Input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Create a password'
              minLength={6}
              required
            />
          </div>

          {/* Submit Button */}
          <SubmitButton pendingText='Signing up...'>
            Create Account
          </SubmitButton>
        </form>

        {message && (
          <div
            className={`mt-4 rounded-md p-4 ${
              isSuccess
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <div className='flex'>
              <div className='flex-shrink-0'>
                {isSuccess ? (
                  <svg
                    className='h-5 w-5 text-green-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-5 w-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium'>{message}</h3>
              </div>
            </div>
          </div>
        )}

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
