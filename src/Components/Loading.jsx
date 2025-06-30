

import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative">

        <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl"></div>

   
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full border-4 border-gray-800"></div>
          <div className="absolute h-24 w-24 rounded-full border-t-4 border-white animate-spin"></div>

    
          <div className="absolute h-16 w-16 rounded-full border-2 border-gray-600 animate-pulse"></div>
        </div>
      </div>


      <div className="mt-8 text-white font-medium tracking-wider text-xl flex items-center space-x-1">
        <span>LOADING</span>
        <span className="flex space-x-1">
          <span className="animate-bounce delay-0 inline-block">.</span>
          <span className="animate-bounce delay-150 inline-block">.</span>
          <span className="animate-bounce delay-300 inline-block">.</span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
