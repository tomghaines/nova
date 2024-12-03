'use client';

import { Tabs, TabsTrigger, TabsContent, TabsList } from '@radix-ui/react-tabs';
import { AccountDetails } from '@/components/features/account/accountDetails';
import { Newsletter } from '@/components/features/account/newsletter/signup';
import { Billing } from '@/components/features/account/billing';

export default function AccountPage() {
  return (
    <div className='ml-6 flex h-screen w-full flex-col dark:text-neutral-400'>
      <div className='p-16'>
        <h1 className='mb-2 ml-1 text-4xl font-bold dark:text-neutral-200'>
          Account
        </h1>
        <p className='mb-6 ml-1'>
          View your account's details and manage your billing
        </p>
        <Tabs className='w-full' defaultValue='account'>
          <TabsList className='flex justify-start gap-2 rounded-md'>
            {/* Account Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md hover:bg-neutral-100 data-[state="active"]:bg-neutral-600'
              value='account'
            >
              Account Details
            </TabsTrigger>

            {/* Billing Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md hover:bg-neutral-100 data-[state="active"]:bg-neutral-600'
              value='billing'
            >
              Billing
            </TabsTrigger>

            {/* Newsletter Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md hover:bg-neutral-100 data-[state="active"]:bg-neutral-600'
              value='newsletter'
            >
              Newsletter
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className='mt-10 flex rounded-xl border p-8 dark:border-neutral-600 dark:bg-neutral-900'>
            <TabsContent value='account'>
              <AccountDetails />
            </TabsContent>
            <TabsContent value='billing'>
              <Billing />
            </TabsContent>
            <TabsContent value='newsletter'>
              <Newsletter />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
