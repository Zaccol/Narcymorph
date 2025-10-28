import React, { useState, useEffect } from 'react';
import { User, Friend, ProfileData, ChatMessage } from '../types';
import Questionnaire from './Questionnaire';
import Portrait from './Portrait';
import Associations from './Associations';
import FriendList from './FriendList';
import MainMenu from './MainMenu';
import DiscoverAssociations from './DiscoverAssociations';
import AssociationDetailModal from './AssociationDetailModal';
import ChatBubble from './ChatBubble';
import ChatInterface from './ChatInterface';
import { generateMentalPortrait } from '../services/geminiService';


interface ProfileScreenProps {
  user: User;
  profileData: ProfileData | null;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
  friends: Friend[];
  onLogout: () => void;
}

export type ActiveView = 'profile' | 'associations' | 'friends' | 'search';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profileData, setProfileData, friends, onLogout }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('profile');
  const [selectedAssociation, setSelectedAssociation] = useState<{title: string, value: string} | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    // Load chat history from local storage when component mounts
    const savedHistory = localStorage.getItem(`chatHistory_${user.name}`);
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, [user.name]);
  
  const handleUpdateChatHistory = (newHistory: ChatMessage[]) => {
    setChatHistory(newHistory);
    localStorage.setItem(`chatHistory_${user.name}`, JSON.stringify(newHistory));
  };


  const displayedProfile = selectedFriend ? selectedFriend.profile : profileData;
  const displayedName = selectedFriend ? selectedFriend.name : user.name;

  const viewFriendProfile = (friend: Friend) => {
    setSelectedFriend(friend);
    setActiveView('profile');
  };

  const handleNav = (view: ActiveView) => {
    if (view === 'profile') {
      setSelectedFriend(null);
    }
    setActiveView(view);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainMenu user={user} onLogout={onLogout} activeView={activeView} setActiveView={handleNav} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeView === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-serif-display mb-8">
              <span className="text-gray-400 font-light">{selectedFriend ? "Profil de " : "Votre Profil "}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">{displayedName}</span>
            </h2>

            {!profileData && !selectedFriend && (
              <Questionnaire setProfileData={setProfileData} />
            )}

            {displayedProfile ? (
              <div className="space-y-8">
                <Portrait text={displayedProfile.portrait} isRegenerating={isRegenerating} />
                <Associations
                  associations={displayedProfile.associations}
                  onAssociationClick={(title, value) => setSelectedAssociation({title, value})}
                  onDiscoverClick={() => setActiveView('associations')}
                />
              </div>
            ) : (
              !selectedFriend && (
                <div className="text-center py-20">
                  <p className="text-gray-400">Complétez le questionnaire pour générer votre portrait mental.</p>
                </div>
              )
            )}
            {selectedFriend && !displayedProfile && (
              <div className="text-center py-20">
                <p className="text-gray-400">{selectedFriend.name} n'a pas encore généré de profil.</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'associations' && (
          profileData ? (
            <DiscoverAssociations
              portrait={profileData.portrait}
              existingAssociations={profileData.associations}
              chatHistory={chatHistory}
              onBack={() => handleNav('profile')}
              onAssociationAdd={(type, value) => {
                setProfileData(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    associations: {
                      ...prev.associations,
                      [type]: value,
                    }
                  };
                });
                handleNav('profile');
              }}
            />
          ) : (
            <div className="text-center py-20 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white font-serif-display">Profil Requis</h2>
              <p className="text-gray-400">Veuillez d'abord compléter votre profil pour pouvoir découvrir vos associations symboliques.</p>
              <button
                onClick={() => handleNav('profile')}
                className="mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Créer mon profil
              </button>
            </div>
          )
        )}

        {activeView === 'friends' && (
          <FriendList friends={friends} onViewProfile={viewFriendProfile} />
        )}

        {activeView === 'search' && (
          <div className="text-center py-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white font-serif-display">Recherche</h2>
            <p className="text-gray-400">La fonctionnalité de recherche sera bientôt disponible.</p>
          </div>
        )}
      </main>

       {profileData && (
          <>
            <ChatBubble onClick={() => setIsChatOpen(true)} />
            <ChatInterface 
              user={user} 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)}
              chatHistory={chatHistory}
              onChatHistoryChange={handleUpdateChatHistory}
            />
          </>
        )}

      <AssociationDetailModal 
        isOpen={!!selectedAssociation}
        onClose={() => setSelectedAssociation(null)}
        association={selectedAssociation}
      />
    </div>
  );
};

export default ProfileScreen;
