import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Target, Briefcase, Activity } from 'lucide-react';

export function TopNav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch(err) {
      console.error(err);
    }
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">FA</span>
            </div>
            <span className="font-semibold tracking-tight text-lg hidden sm:inline-block">Focus Architect</span>
          </NavLink>
          
          <nav className="flex items-center gap-4 text-sm font-medium">
            <NavLink 
              to="/" 
              className={({isActive}) => `flex items-center gap-1.5 transition-colors hover:text-black ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </NavLink>
            <NavLink 
              to="/missions" 
              className={({isActive}) => `flex items-center gap-1.5 transition-colors hover:text-black ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline-block">Missions</span>
            </NavLink>
            <NavLink 
              to="/sessions" 
              className={({isActive}) => `flex items-center gap-1.5 transition-colors hover:text-black ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sessions</span>
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:inline-block">
            {currentUser.displayName || currentUser.email}
          </span>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
