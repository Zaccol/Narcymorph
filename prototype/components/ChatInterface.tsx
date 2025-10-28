import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { User, ChatMessage } from '../types';
import { systemInstructionChat } from '../services/geminiService';
import Spinner from './common/Spinner';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  chatHistory: ChatMessage[];
  onChatHistoryChange: (history: ChatMessage[]) => void;
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, user, chatHistory, onChatHistoryChange }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initChat = async () => {
        setIsLoading(true);
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstructionChat,
            },
        });
        setChatSession(chat);

        if (chatHistory.length === 0) {
            // Send an empty message to get the initial greeting
            try {
                const response = await chat.sendMessage({ message: "" });
                onChatHistoryChange([{ sender: 'ai', text: response.text }]);
            } catch (error) {
                console.error("Error initializing chat:", error);
                onChatHistoryChange([{ sender: 'ai', text: "Bonjour ! Je suis Narcymorph. J'ai du mal à me connecter en ce moment, veuillez réessayer plus tard." }]);
            }
        }
        setIsLoading(false);
      };
      initChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const newHistory = [...chatHistory, userMessage];
    onChatHistoryChange(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: input });
      const aiMessage: ChatMessage = { sender: 'ai', text: response.text };
      onChatHistoryChange([...newHistory, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { sender: 'ai', text: "Désolé, une erreur s'est produite. Pourriez-vous répéter ?" };
      onChatHistoryChange([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-96 sm:h-[600px] bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col z-50 transform-gpu transition-transform duration-300 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">
          Chat avec Narcymorph
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white">&times;</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-fuchsia-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
           {isLoading && chatHistory.length > 0 && (
            <div className="flex justify-start">
                 <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
                    <Spinner small />
                 </div>
            </div>
           )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            className="w-full bg-transparent px-4 py-2 text-gray-200 focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" className="p-2 text-fuchsia-400 hover:text-fuchsia-300 disabled:text-gray-600" disabled={isLoading || !input.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
