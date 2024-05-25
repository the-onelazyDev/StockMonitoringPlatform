import React from 'react';
import { Outlet } from 'react-router-dom';

interface DefaultLayoutProps {
  theme: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ theme }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'lightgray', padding: '1rem' }}>
        {/* Header content */}
        <nav>
          {/* Navigation links */}
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        {/* Main content area */}
        <Outlet />
      </main>
      <footer style={{ backgroundColor: 'lightgray', padding: '1rem' }}>
        {/* Footer content */}
        <p>Current theme: {theme}</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;