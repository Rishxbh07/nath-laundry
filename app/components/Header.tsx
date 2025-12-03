import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center border-b border-blue-50/50">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-(family-name:--font-comfortaa)">

        <span className="bg-linear-to-r from-blue-700 via-blue-500 to-sky-400 bg-clip-text text-transparent">
          Nath Drycleaners
        </span>
      </h1>
    </header>
  );
}