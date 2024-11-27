'use client';

import React, { useState } from 'react';

interface AuthProps {
  onAuthenticate: () => void; // Inform Layout of successful login
}

const Auth: React.FC<AuthProps> = ({ onAuthenticate }) => {
  // Define the handleTwitterLogin function
  const handleTwitterLogin = () => {
    console.log('Simulating Twitter SSO login...');
    // Simulate successful login
    setTimeout(() => {
      onAuthenticate(); // Notify parent component of successful authentication
    }, 1000); // Simulate network delay
  };

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
          <button
            onClick={handleTwitterLogin}
            className='flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50'
          >
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg'
              alt='Twitter Icon'
              className='mr-2 h-5 w-5'
            />
            Continue with Twitter
          </button>
        </div>

        <div className='mt-6 flex items-center justify-center'>
          <div className='w-full border-t border-gray-300'></div>
          <span className='mx-4 text-sm text-gray-500'>OR</span>
          <div className='w-full border-t border-gray-300'></div>
        </div>

        <form className='mt-6'>
          {/* Username Input */}
          <div className='mb-4'>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              placeholder='Your username'
              className='focus:ring-grey-500 focus:border-grey-500 mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm sm:text-sm'
            />
          </div>

          {/* Email Input */}
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='Enter email'
              className='mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
          </div>

          {/* Password Input */}
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='Create a password'
              className='mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200'
          >
            Create Account
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-600 hover:underline'>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
