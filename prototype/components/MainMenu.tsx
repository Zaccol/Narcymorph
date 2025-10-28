import React from 'react';
import { User } from '../types';
import { ActiveView } from './ProfileScreen';

interface MainMenuProps {
  user: User;
  onLogout: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ user, onLogout, activeView, setActiveView }) => {
  const navItems = [
    { id: 'profile', label: 'Mon Profil' },
    { id: 'associations', label: 'Associations' },
    { id: 'friends', label: 'Amis' },
    { id: 'search', label: 'Rechercher' },
  ];

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 font-serif-display">
            Narcymorph
          </h1>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-fuchsia-500/20 text-fuchsia-200'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hidden sm:block">Bonjour, {user.name}</span>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-fuchsia-500 px-4 py-2 rounded-full transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainMenu;
