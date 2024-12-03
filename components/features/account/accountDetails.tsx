'use client';

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { DataList } from '@radix-ui/themes';
import { CopyIcon, SquareUser } from 'lucide-react';
import { copyToClipboard } from '@/utils/clipboardUtils';
import LoadingSpinner from '@/components/ui/loader';

export const AccountDetails = () => {
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

      const { error: uploadError } = await supabase.storage
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
      setImageUrl(`${publicUrl}?t=${new Date().getTime()}`);

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
    return <LoadingSpinner isLoading={true} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className='mt-4 flex flex-col gap-8 p-4'>
      {/* Avatar section */}
      <div className='flex gap-10'>
        <div className='relative h-20 w-28'>
          <Avatar>
            {/* Show the image URL from state, or a default URL if not yet set */}
            <AvatarImage
              src={
                imageUrl ||
                userData.user_metadata.avatar_url ||
                'https://github.com/shadcn.png'
              }
              alt='User Avatar'
              className='h-20 w-20 rounded-full border-2 border-gray-300'
            />
          </Avatar>
          {/* Edit Photo button */}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className='absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border border-black bg-white text-lg font-thin text-black hover:brightness-90 dark:invert'
          >
            +
          </button>
        </div>

        {/* Display user metadata */}
        <div>
          <div className='ml-16 flex'>
            <SquareUser className='mt-1' />
            <h2 className='mb-4 ml-4 text-2xl font-bold'>Profile Setting</h2>
          </div>
          <div className='mb-8 ml-16 w-[520px] border-t-2 dark:border-neutral-600'></div>
          <DataList.Root className='ml-16 grid w-full gap-1'>
            <DataList.Item className='grid grid-cols-3 items-center'>
              <DataList.Label className=''>Account ID</DataList.Label>
              <div className='flex rounded-xl border p-2 dark:border-neutral-600 dark:bg-neutral-800'>
                <DataList.Value>{userData.id}</DataList.Value>
                <CopyIcon
                  onClick={() => copyToClipboard(userData.id)}
                  className='h-7 w-7 rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
                />
              </div>
            </DataList.Item>
            <DataList.Item className='grid grid-cols-3 items-center'>
              <DataList.Label>Username</DataList.Label>
              <DataList.Value>{userData.user_metadata.username}</DataList.Value>
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
      </div>

      {/* Image upload form (conditionally rendered) */}
      {isEditing && (
        <div className='space-around ml-40 flex rounded-md border-gray-200'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='mb-4 ml-6 mt-4 py-2'
          />
          <button
            onClick={uploadImage}
            disabled={uploading}
            className='mt-6 h-7 w-[120px] rounded-sm border border-gray-600 bg-gray-100 text-black'
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}
    </div>
  );
};
