import React from 'react';
import FinalCta from '../components/FinalCta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F0E8' }}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-6xl">
           <FinalCta />
        </div>
      </div>
      <Footer />
    </div>
  );
}
