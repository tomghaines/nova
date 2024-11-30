'use client';

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

export default function AccountPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setError(error);
        } else if (data.user) {
          setUserData(data.user);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className='flex flex-col items-center justify-start'>
      <div className='px-6 pl-[100px] text-center'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
          Account
        </h1>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          Manage your account settings and preferences
        </p>
        <div>
          <Avatar className='h-6 w-6'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          </Avatar>
          <p>Username: {userData.user_metadata.username}</p>
          <p>Email: {userData.email}</p>
          <p>
            Sign Up Date:{' '}
            {new Date(userData.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          {/* Add more user data as needed */}
        </div>
      </div>
    </div>
  );
}
