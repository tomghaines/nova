import { useState } from 'react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Popup window for successful newsletter sign up */
    const showSuccessPopup = () => {

      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
      popup.innerHTML = `
        <div class='bg-white p-8 rounded-lg text-center dark:bg-black'>
          <h3 class='text-xl font-bold mb-4 dark:text-zinc-200'>You're In!</h3>
          <p class='text-md mb-6 dark:text-zinc-200'>You've successfully signed up for the birdy.ai newsletter report.</p>
          <button class='bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50' id='closePopup'>
            Close
          </button>
        </div>
      `;
      document.body.appendChild(popup);

      const closeButton = popup.querySelector('#closePopup');
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
      });
    }
    
    /* POST request to add a new subscriber email */
    try {
      const response = await fetch('/api/newsletter/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showSuccessPopup();
      } else {
        // Handle error
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <h2 className='text-2xl font-bold'>Newsletter</h2>
      <p className='text-lg'>Sign up for our newsletter to stay updated with the latest news and updates.</p>
      
      <form className='flex flex-row gap-4 items-center' onSubmit={handleSubmit}>
        <label htmlFor='email' className='text-md font-medium'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          required
          className='p-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <button
          type='submit'
          className='bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Sign Up
        </button>
      </form>
    </div>
  )
};