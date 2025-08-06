import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, ListPlus, Image, Bell, LogOut, Sparkle, BarChart3, Users } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: ListPlus },
    { id: 'blogs', label: 'Blogs', icon: ListPlus },
    { id: 'hero', label: 'Hero Section', icon: Image },
    { id: 'banner', label: 'Quiz', icon: Image },
    { id: 'updates', label: 'Latest Updates', icon: Bell },
    { id: 'sponser', label: 'Sponser ', icon: Sparkle },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 via-blue-800 to-sky-700 shadow-2xl transition-all duration-300 ease-in-out relative overflow-hidden`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/20 via-transparent to-blue-400/20"></div>
          <div className="absolute top-1/4 right-0 w-32 h-32 bg-sky-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-24 h-24 bg-blue-300/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-blue-600/30 bg-gradient-to-r from-blue-800/50 to-sky-700/50 backdrop-blur-sm">
            <div className={`${!isSidebarOpen && 'hidden'}`}>
              <h2 className="font-bold text-xl bg-gradient-to-r from-sky-200 via-white to-blue-200 bg-clip-text text-transparent mb-1">
                Vidyabani Admin
              </h2>
              <p className="text-xs text-sky-300/80 font-medium">
                Developed by Cripcocode Technologies Pvt Ltd
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-700/50 rounded-lg transition-all duration-200 text-sky-200 hover:text-white hover:scale-105"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-4 rounded-xl mb-2 hover:bg-gradient-to-r hover:from-blue-700/60 hover:to-sky-600/60 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-600/80 to-sky-500/80 border-r-4 border-sky-300 shadow-lg scale-105' 
                    : 'hover:border-r-2 hover:border-sky-400/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-sky-600/30' : 'bg-blue-700/20'}`}>
                  <item.icon size={18} className={`${activeSection === item.id ? 'text-sky-200' : 'text-blue-200'}`} />
                </div>
                {isSidebarOpen && (
                  <span className={`ml-4 font-medium ${activeSection === item.id ? 'text-sky-200 font-semibold' : 'text-blue-200'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            ))}
            
            {/* Logout Button */}
            <div className="mt-8 pt-4 border-t border-blue-600/30">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-4 rounded-xl hover:bg-red-600/20 text-red-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <div className="p-2 rounded-lg bg-red-600/20">
                  <LogOut size={18} />
                </div>
                {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
              </button>
            </div>
          </nav>

          {/* Footer Branding */}
          {isSidebarOpen && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gradient-to-r from-blue-800/50 to-sky-700/50 backdrop-blur-sm rounded-lg p-3 border border-blue-600/30">
                <p className="text-xs text-center text-sky-300/80 font-medium">
                  © 2024 Cripcocode Technologies Pvt Ltd
                </p>
                <p className="text-xs text-center text-sky-200/60 mt-1">
                  All rights reserved
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Dashboard activeSection={activeSection} />
      </div>
    </div>
  );
}

export default App;