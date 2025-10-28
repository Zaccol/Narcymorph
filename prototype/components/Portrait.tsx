import React from 'react';
import Spinner from './common/Spinner';

interface PortraitProps {
  text: string;
  isRegenerating?: boolean;
}

const Portrait: React.FC<PortraitProps> = ({ text, isRegenerating = false }) => {
  return (
    <div className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">
          Votre Portrait Mental
        </h3>
        {isRegenerating && (
          <div className="flex items-center gap-2 text-sm text-fuchsia-300">
            <Spinner small />
            <span>Affinement...</span>
          </div>
        )}
      </div>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
};

export default Portrait;
