import React from 'react';
import LoginCard from '../components/LoginCard';
import { AkupyLogo } from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="login-page">
      {/* Minimal top bar */}
      <header className="login-page-header">
        <Link to="/shop">
          <AkupyLogo size="sm" dark={false} />
        </Link>
      </header>

      {/* Centered Card */}
      <main className="login-page-main">
        <LoginCard />
      </main>
    </div>
  );
}
