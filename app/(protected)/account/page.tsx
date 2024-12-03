'use client';

import { Tabs, TabsTrigger, TabsContent, TabsList } from '@radix-ui/react-tabs';
import { AccountDetails } from '@/components/features/account/accountDetails';
import { Newsletter } from '@/components/features/account/newsletter/signup';
import { Billing } from '@/components/features/account/billing';

export default function AccountPage() {
  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='p-16'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100'>
          Account
        </h1>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          View your account's details and manage your billing
        </p>
        <Tabs className='w-full' defaultValue='account'>
          <TabsList className='flex justify-start gap-2 rounded-md border border-zinc-300 p-5'>
            {/* Account Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md py-2 text-emerald-500 hover:bg-emerald-100 data-[state="active"]:bg-emerald-200 data-[state="active"]:text-emerald-700'
              value='account'
            >
              Account Details
            </TabsTrigger>

            {/* Billing Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md text-emerald-500 hover:bg-emerald-100 data-[state="active"]:bg-emerald-200 data-[state="active"]:text-emerald-700'
              value='billing'
            >
              Billing
            </TabsTrigger>

            {/* Newsletter Tab */}
            <TabsTrigger
              className='w-[150px] rounded-md text-emerald-500 hover:bg-emerald-100 data-[state="active"]:bg-emerald-200 data-[state="active"]:text-emerald-700'
              value='newsletter'
            >
              Newsletter
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value='account'>
            <AccountDetails />
          </TabsContent>
          <TabsContent value='billing'>
            <Billing />
          </TabsContent>
          <TabsContent value='newsletter'>
            <Newsletter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
