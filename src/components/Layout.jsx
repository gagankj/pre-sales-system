import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area with proper spacing from sidebar */}
      <div className="lg:pl-80"> {/* Increased from pl-72 to pl-80 for better spacing */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-8 px-6 sm:px-8 lg:px-12"> {/* Increased padding for better spacing */}
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs />
            <div className="mt-8"> {/* Increased margin-top for better spacing */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;