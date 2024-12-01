'use client';

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Tabs, TabsTrigger, TabsContent, TabsList } from '@radix-ui/react-tabs';
import { DataList } from '@radix-ui/themes';
import { CopyIcon } from 'lucide-react';
import { copyToClipboard } from '@/utils/clipboardUtils';
import { Spinner } from '@/components/ui/spinner';

export default function AccountPage() {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle image file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async () => {
    if (!image || !userData) return;

    setUploading(true);
    try {
      const filePath = `user-images/${userData.id}/avatar.jpg`;

      if (imageUrl) {
        const { error: deleteError } = await supabase.storage
          .from('user-images')
          .remove([filePath]);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }

      const { data, error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, image);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setImageUrl(publicUrl);

      // Update user metadata with the avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        throw new Error(updateError.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setImage(null);
      setIsEditing(false);
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setError(error);
        } else if (data.user) {
          setUserData(data.user);
          const avatarUrl = data.user.user_metadata.avatar_url;
          if (avatarUrl) {
            setImageUrl(avatarUrl);
          }
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
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='p-16'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
          Account
        </h1>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          View your Account&apos;s Details and manage your billing
        </p>
        <Tabs className='w-full ' defaultValue='account'>
          <TabsList className='flex justify-start rounded-md border border-zinc-300 p-5 gap-2'>
            {/* Account Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md py-2 text-zinc-500 hover:bg-indigo-100 data-[state="active"]:bg-indigo-200 data-[state="active"]:text-indigo-600'
              value='account'
            >
              Account Details
            </TabsTrigger>

            {/* Billing Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md text-zinc-500 hover:bg-indigo-100 data-[state="active"]:bg-indigo-200 data-[state="active"]:text-indigo-600'
              value='billing'
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              className='w-[150px] rounded-md text-zinc-500 hover:bg-indigo-100 data-[state="active"]:bg-indigo-200 data-[state="active"]:text-indigo-600'
              value='newsletter'
            >
              Newsletter
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value='account' className='flex flex-col gap-8 p-4'>
            <h2 className='text-2xl font-bold'>Account Details</h2>
            {/* Avatar section */}
            <div className='flex gap-10'>
              <div className='h-16 w-16'>
                <Avatar>
                  {/* Show the image URL from state, or a default URL if not yet set */}
                  <AvatarImage
                    src={
                      imageUrl ||
                      userData.user_metadata.avatar_url ||
                      'https://github.com/shadcn.png'
                    }
                    alt='User Avatar'
                  />
                </Avatar>
                {/* Edit Photo button */}
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'
                >
                  {isEditing ? 'Cancel' : 'Edit Photo'}
                </button>
              </div>
              {/* Display user metadata */}

              <DataList.Root className='grid w-full gap-4'>
                <DataList.Item className='grid grid-cols-3 items-center'>
                  <DataList.Label>Account ID</DataList.Label>
                  <DataList.Value>{userData.id}</DataList.Value>
                  <CopyIcon
                    onClick={() => copyToClipboard(userData.id)}
                    className='h-7 w-7 rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
                  />
                </DataList.Item>
                <DataList.Item className='grid grid-cols-3 items-center'>
                  <DataList.Label>Username</DataList.Label>
                  <DataList.Value>
                    {userData.user_metadata.username}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item className='grid grid-cols-3 items-center'>
                  <DataList.Label>Email</DataList.Label>
                  <DataList.Value>{userData.email}</DataList.Value>
                </DataList.Item>
                <DataList.Item className='grid grid-cols-3 items-center'>
                  <DataList.Label>Sign Up Date</DataList.Label>
                  <DataList.Value>
                    {new Date(userData.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </div>
          </TabsContent>
          <TabsContent value='billing' className='flex flex-col gap-8 p-4'>
            <h2 className='text-2xl font-bold'>Billing</h2>
          </TabsContent>
          <TabsContent value='newsletter' className='flex flex-col gap-8'>
            <h2 className='text-2xl font-bold'>Newsletter</h2>
            <form className='flex flex-col gap-4' onSubmit={(e) => { e.preventDefault(); alert('Thank you for signing up!'); }}>
              <label htmlFor='email' className='text-md font-medium'>Email Address</label>
              <input
                type='email'
                id='email'
                name='email'
                required
                className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                placeholder='Enter your email address'
              />
              
              <button
                type='submit'
                className='bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              >
                Sign Up
              </button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Image upload form (conditionally rendered) */}
        {isEditing && (
          <div className='mt-6'>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='mb-4'
            />
            <button
              onClick={uploadImage}
              disabled={uploading}
              className='rounded bg-blue-500 px-4 py-2 text-white'
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
