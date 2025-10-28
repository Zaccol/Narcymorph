import React from 'react';
import { Associations as AssociationsType } from '../types';

interface AssociationsProps {
  associations: AssociationsType;
  onDiscoverClick: () => void;
  onAssociationClick: (title: string, value: string) => void;
}

const AssociationCard: React.FC<{ title: string; value: string, onClick: () => void }> = ({ title, value, onClick }) => {
    const parts = value.split('\n\n');
    const name = parts[0] || "N/A";
    const explanation = parts.slice(1).join('\n\n');

    return (
        <button onClick={onClick} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 h-full flex flex-col text-left hover:border-fuchsia-500 transition-colors w-full">
            <h4 className="text-sm font-semibold text-fuchsia-300 uppercase tracking-wider">{title}</h4>
            <p className="text-gray-200 mt-1 font-serif-display text-xl font-bold">{name}</p>
            <p className="text-gray-400 mt-2 text-sm line-clamp-3 flex-grow">{explanation}</p>
        </button>
    );
};

const AssociationsComponent: React.FC<AssociationsProps> = ({ associations, onDiscoverClick, onAssociationClick }) => {
  const isViewingFriend = !onDiscoverClick;

  return (
    <div className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl">
      <h3 className="text-2xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-6">
        Associations Symboliques
      </h3>
      
      {Object.keys(associations).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(associations).map(([type, value]) => (
                <AssociationCard 
                    key={type} 
                    title={type} 
                    value={value}
                    onClick={() => onAssociationClick(type, value)}
                />
            ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mb-6">
            {isViewingFriend ? "Aucune association pour le moment." : "Découvrez vos associations en cliquant ci-dessous."}
        </p>
      )}

      {!isViewingFriend && (
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <button
                onClick={onDiscoverClick}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            >
                Découvrir de nouvelles associations
            </button>
        </div>
      )}
    </div>
  );
};

export default AssociationsComponent;
