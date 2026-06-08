import React from 'react';

const TABS = ['vehicles', 'customers', 'users', 'promotions'];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex border-b border-gray-300 bg-white px-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
            activeTab === tab
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
