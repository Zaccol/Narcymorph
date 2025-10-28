import React, { useState, useEffect } from 'react';
import { generateMentalPortrait } from '../services/geminiService';
import { ProfileData, QuestionnaireAnswers } from '../types';
import Spinner from './common/Spinner';

interface QuestionnaireProps {
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
}

const questions = {
  memoire: "Décrivez un souvenir, réel ou imaginaire, qui vous semble central à qui vous êtes.",
  paysage: "Si votre monde intérieur était un paysage, à quoi ressemblerait-il ?",
  trace: "Si vous pouviez laisser une seule trace de votre passage sur Terre, quelle serait-elle ?",
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    mimeType: file.type,
    data: await base64EncodedDataPromise,
  };
};


const Questionnaire: React.FC<QuestionnaireProps> = ({ setProfileData }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({ memoire: '', paysage: '', trace: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Analyse des traits...");

  useEffect(() => {
    let intervalId: number;
    if (isLoading) {
      const messages = ["Analyse des traits...", "Création du profil mental...", "Analyse de la psyché..."];
      let messageIndex = 0;
      setLoadingMessage(messages[0]);
      intervalId = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || Object.values(answers).some(a => a.trim() === '')) {
      setError("Veuillez télécharger une photo et répondre à toutes les questions.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
        const imagePart = await fileToGenerativePart(photo);
        const portrait = await generateMentalPortrait(imagePart.data, imagePart.mimeType, answers);
        setProfileData({
            portrait,
            associations: {},
        });
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
        <Spinner />
        <p className="mt-4 text-fuchsia-300 font-serif-display text-xl">{loadingMessage}</p>
        <p className="text-gray-400">Cela peut prendre un moment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">Créer Votre Portrait</h2>
        <p className="text-gray-400 mt-2">Votre reflet et vos mots façonneront le cœur de votre profil.</p>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-fuchsia-500 transition-colors">
                    {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                    ) : (
                    <span className="text-gray-500 text-center">Télécharger une photo de vous</span>
                    )}
                </div>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>
        <div className="w-full md:w-2/3 space-y-4">
             {Object.entries(questions).map(([key, question]) => (
                <div key={key}>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">{question}</label>
                    <textarea
                        name={key}
                        value={answers[key]}
                        onChange={handleAnswerChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
                    />
                </div>
             ))}
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500"
        >
          Générer le Portrait
        </button>
      </div>
    </form>
  );
};

export default Questionnaire;