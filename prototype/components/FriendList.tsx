import React from 'react';
import { Friend } from '../types';

interface FriendListProps {
  friends: Friend[];
  onViewProfile: (friend: Friend) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onViewProfile }) => {
  return (
    <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-serif-display mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">
            Liste d'amis
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map(friend => (
                <div key={friend.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center text-center transition-all transform hover:scale-105 hover:border-fuchsia-500/50">
                    <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-3xl text-white">
                        {friend.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-white">{friend.name}</h3>
                    <button
                        onClick={() => onViewProfile(friend)}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300 text-sm"
                    >
                        Voir le Profil
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default FriendList;