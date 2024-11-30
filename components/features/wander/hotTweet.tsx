import React from 'react';

interface CardProps {
  label: string;
  title: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ label, title, content }) => {
  return (
    <div className='h-auto w-auto p-4'>
      {/* Card */}
      <div className='h-auto w-full rounded-3xl border border-4 border-black p-6 duration-700 hover:scale-105 hover:brightness-90'>
        {/* Label */}
        <div className='mb-4 inline-block w-auto rounded-xl border border-black bg-white p-1'>
          <span className='ml-2 mr-2'>{label}</span>
        </div>
        {/* Content */}
        <h1 className='mb-2 text-2xl font-bold'>{title}</h1>
        <p className='text-md font-thin'>{content}</p>
      </div>
    </div>
  );
};

export default Card;
