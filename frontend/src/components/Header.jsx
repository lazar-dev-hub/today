import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold tracking-tight">
        Promotion Management System
      </h1>
      <span className="text-sm text-gray-400">PMS Dashboard</span>
    </header>
  );
}
