'use client';

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Tabs, TabsTrigger, TabsContent, TabsList } from '@radix-ui/react-tabs';
import { DataList } from '@radix-ui/themes';

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
      const filePath = `user-images/${userData.id}-${image.name}`;

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

      console.log('Image uploaded and user metadata updated');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
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
          console.log(data.user);
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
    <div className='flex flex-col'>
      <div>
        <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
          Account
        </h1>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          Manage your account settings and preferences
        </p>
        <Tabs defaultValue='account'>
          <TabsList className='flex justify-around rounded-md bg-gray-200 p-2'>
            {/* Account Tab */}
            <TabsTrigger
              className='rounded-md px-14 py-3 data-[state="active"]:bg-blue-500 data-[state="active"]:text-white'
              value='account'
            >
              Account
            </TabsTrigger>

            {/* Billing Tab */}
            <TabsTrigger
              className='rounded-md px-14 data-[state="active"]:bg-blue-500 data-[state="active"]:text-white'
              value='billing'
            >
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value='account' className='p-4'>
            {/* Avatar section */}
            <div className='flex gap-10'>
              <div className='h-16 w-16 border'>
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
              </div>
              {/* Display user metadata */}
              <div className='flex w-max flex-col'>
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>Account ID</DataList.Label>
                    <DataList.Value>{userData.id}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Username</DataList.Label>
                    <DataList.Value>
                      {userData.user_metadata.username}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Email</DataList.Label>
                    <DataList.Value>{userData.email}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Sign Up Date</DataList.Label>
                    <DataList.Value>
                      {new Date(userData.created_at).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }
                      )}
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </div>
            </div>

            {/* Edit Photo button */}
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'
            >
              {isEditing ? 'Cancel' : 'Edit Photo'}
            </button>
          </TabsContent>
          <TabsContent value='billing' className='p-4'>
            Billing
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
