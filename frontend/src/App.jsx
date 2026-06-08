import React, { useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import VehiclePanel from './components/VehiclePanel';
import CustomerPanel from './components/CustomerPanel';
import UserPanel from './components/UserPanel';
import PromoPanel from './components/PromoPanel';

const PANELS = {
  vehicles: VehiclePanel,
  customers: CustomerPanel,
  users: UserPanel,
  promotions: PromoPanel,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const Panel = PANELS[activeTab];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Panel />
      </main>
    </div>
  );
}
