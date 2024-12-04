import { useState } from 'react';
import { Mail } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Popup window for successful newsletter sign up */
    const showSuccessPopup = (message: string) => {
      const popup = document.createElement('div');
      popup.className =
        'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
      popup.innerHTML = `
        <div class='bg-white p-8 rounded-lg text-center dark:bg-black'>
          <h3 class='text-xl font-bold mb-4 dark:text-zinc-200'>You're In!</h3>
          <p class='text-md mb-6 dark:text-zinc-200'>
          ${message}
          </p>
          <button class='bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50' id='closePopup'>
            Close
          </button>
        </div>
      `;
      document.body.appendChild(popup);

      const closeButton = popup.querySelector('#closePopup');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          document.body.removeChild(popup);
        });
      }
    };

    /* POST request to add a new subscriber email */
    try {
      const response = await fetch('/api/newsletter/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessPopup(data.message || "You've successfully signed up!");
      } else if (response.status === 400 || response.status === 409) {
        const data = await response.json();
        showSuccessPopup(data.message || "You've already signed up!");
      } else {
        // Handle error
        console.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      showSuccessPopup(
        'Failed to connect to the server. Please try again later.'
      );
    }
  };

  return (
    <div className='mb-10 ml-6 mt-10 flex flex-col'>
      <div className='flex'>
        <Mail className='mt-1' />
        <h2 className='ml-4 text-2xl font-bold text-neutral-400'>Newsletter</h2>
      </div>
      <p className='text-md mt-2 text-neutral-400'>
        Sign up for our newsletter to stay updated with the latest news and
        updates.
      </p>

      <form
        className='mt-10 flex flex-row items-center gap-4'
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          id='email'
          name='email'
          required
          className='w-64 rounded-lg border border-zinc-300 bg-black p-2 text-zinc-100 focus:border-emerald-500 focus:outline-none'
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type='submit'
          className='rounded-lg border border-emerald-700 bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50'
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
