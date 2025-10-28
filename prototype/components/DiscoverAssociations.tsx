import React, { useState, useEffect } from 'react';
import { generateAssociation } from '../services/geminiService';
import Spinner from './common/Spinner';
import { Associations, ChatMessage } from '../types';

interface DiscoverAssociationsProps {
  portrait: string;
  existingAssociations: Associations;
  chatHistory: ChatMessage[];
  onBack: () => void;
  onAssociationAdd: (type: string, value: string) => void;
}

interface Result {
    type: string;
    name: string;
    explanation: string;
    rawValue: string;
}

const allCategories = [
  { key: 'Couleur', title: 'Couleur Spirituelle', description: 'Quelle teinte résonne avec votre âme ?' },
  { key: 'Animal Totem', title: 'Animal Totem', description: 'Quelle créature incarne votre esprit ?' },
  { key: 'Objet', title: 'Objet Symbolique', description: 'Quel artefact symbolise votre parcours ?' },
  { key: 'Personnage de Naruto', title: 'Personnage de Naruto', description: 'Quel ninja de Konoha sommeille en vous ?' },
  { key: 'Maison de Poudlard', title: 'Maison de Poudlard', description: 'Sous quel étendard vous rangeriez-vous à Poudlard ?' },
];

const DiscoverAssociations: React.FC<DiscoverAssociationsProps> = ({ portrait, existingAssociations, chatHistory, onBack, onAssociationAdd }) => {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Sondage de l'inconscient...");

  const availableCategories = allCategories.filter(cat => !existingAssociations[cat.title]);

  useEffect(() => {
    let intervalId: number;
    if (loadingCategory) {
      const messages = ["Sondage de l'inconscient...", "Recherche de symboles...", "Révélation imminente..."];
      let messageIndex = 0;
      setLoadingMessage(messages[0]);
      intervalId = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [loadingCategory]);


  const handleDiscover = async (category: { key: string, title: string }) => {
    setError(null);
    setLoadingCategory(category.title);
    try {
      const associationValue = await generateAssociation(portrait, category.key, chatHistory);
      const parts = associationValue.split('\n\n');
      const name = parts[0];
      const explanation = parts.slice(1).join('\n\n');
      setResult({ type: category.title, name, explanation, rawValue: associationValue });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setLoadingCategory(null);
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <Spinner />
        <p className="mt-4 text-fuchsia-300 font-serif-display text-2xl">{loadingMessage}</p>
        <p className="text-gray-400 text-lg">Découverte de votre "{loadingCategory}"</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="relative w-full max-w-2xl p-8 space-y-6 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl text-center overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-600/40 rounded-full filter blur-3xl animate-pulse"></div>
            </div>
            <div className="relative z-10">
                <h2 className="text-lg font-semibold text-fuchsia-300 uppercase tracking-wider">{result.type}</h2>
                <h3 className="text-4xl md:text-5xl font-bold font-serif-display my-4 text-white">{result.name}</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-left">{result.explanation}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <button 
                        onClick={() => onAssociationAdd(result.type, result.rawValue)}
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                        Ajouter au Profil
                    </button>
                    <button 
                        onClick={() => setResult(null)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                        Explorer une autre association
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-4 sm:mb-0">
              Découvrir vos Associations
          </h1>
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-fuchsia-500 px-4 py-2 rounded-full transition-colors self-start sm:self-center">
              Retour au Profil
          </button>
      </div>
      
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {availableCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableCategories.map(cat => (
            <div key={cat.key} className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl flex flex-col justify-between transition-all transform hover:scale-105 hover:border-fuchsia-500/50">
                <div>
                <h3 className="text-xl font-bold font-serif-display text-fuchsia-300">{cat.title}</h3>
                <p className="text-gray-400 mt-2 mb-4">{cat.description}</p>
                </div>
                <button 
                onClick={() => handleDiscover(cat)}
                className="self-start bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full transition-colors duration-300"
                >
                Découvrir
                </button>
            </div>
            ))}
        </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-lg text-gray-300">Félicitations !</p>
                <p className="text-gray-400">Vous avez exploré toutes les catégories d'associations disponibles pour le moment.</p>
            </div>
        )}
    </div>
  );
};

export default DiscoverAssociations;
