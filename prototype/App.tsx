import React, { useState, useEffect } from 'react';
import { User, Friend, ProfileData } from './types';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import Modal from './components/common/Modal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if disclaimer has been shown before
    const disclaimerShown = localStorage.getItem('disclaimerShown');
    if (!disclaimerShown) {
      setShowDisclaimer(true);
    }

    // Mock friends data
    setFriends([
      { id: '1', name: 'Alex', profile: { portrait: 'Une âme à la contemplation tranquille, miroir de la quiétude d\'un lac forestier profond. Sa force réside dans son calme inébranlable et son intuition profonde.', associations: { 'Animal Totem': 'Chouette', 'Couleur Spirituelle': 'Indigo', 'Maison Poudlard': 'Serdaigle' } } },
      { id: '2', name: 'Sam', profile: { portrait: 'Une explosion d\'énergie vibrante, comme un feu de forêt dansant sous un ciel étoilé. Il possède un esprit créatif qui illumine tout ce qu\'il touche.', associations: { 'Animal Totem': 'Renard', 'Couleur Spirituelle': 'Écarlate', 'Clan Naruto': 'Uzumaki' } } },
      { id: '3', name: 'Jess', profile: { portrait: 'Une aventurière dans l\'âme, avec un esprit aussi illimité que l\'océan. Son regard détient la sagesse d\'horizons lointains et d\'histoires inédites.', associations: { 'Animal Totem': 'Aigle', 'Couleur Spirituelle': 'Azur', 'Rang Demon Slayer': 'Hashira' } } },
    ]);
  }, []);
  

  const handleLogin = (name: string) => {
    setUser({ name });
  };

  const handleLogout = () => {
    setUser(null);
    setProfileData(null);
  };
  
  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerShown', 'true');
    setShowDisclaimer(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans antialiased relative overflow-x-hidden">
      {/* Aurora Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vh] bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-teal-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-[30%] right-[10%] w-[50vw] h-[50vh] bg-fuchsia-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <main className="relative z-10">
        {!user ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <ProfileScreen
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
            friends={friends}
            onLogout={handleLogout}
          />
        )}
      </main>

      <Modal isOpen={showDisclaimer} onClose={handleAcceptDisclaimer}>
        <h2 className="text-2xl font-bold mb-4 text-fuchsia-300 font-serif-display">Bienvenue sur Narcymorph</h2>
        <p className="mb-4 text-gray-300">
          Cette application utilise l'IA pour générer des interprétations artistiques et poétiques de la personnalité basées sur vos entrées. L'analyse fournie est uniquement à des fins de divertissement et d'autoréflexion.
        </p>
        <p className="mb-6 text-gray-300">
          Elle ne remplace pas un avis, un diagnostic ou un traitement psychologique professionnel. Toutes les interprétations, y compris celles basées sur la morphopsychologie, sont symboliques et ne doivent pas être considérées comme des déclarations factuelles ou scientifiques.
        </p>
        <button
          onClick={handleAcceptDisclaimer}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          Je comprends et j'accepte
        </button>
      </Modal>
    </div>
  );
};

export default App;