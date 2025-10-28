import React from 'react';
import Modal from './common/Modal';

interface AssociationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  association: { title: string; value: string } | null;
}

const AssociationDetailModal: React.FC<AssociationDetailModalProps> = ({ isOpen, onClose, association }) => {
  if (!isOpen || !association) return null;

  const parts = association.value.split('\n\n');
  const name = parts[0] || "N/A";
  const explanation = parts.slice(1).join('\n\n');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col h-full max-h-[80vh] w-full max-w-2xl p-2 text-center">
            <h2 className="text-lg font-semibold text-fuchsia-300 uppercase tracking-wider flex-shrink-0">{association.title}</h2>
            <h3 className="text-4xl font-bold font-serif-display my-2 text-white flex-shrink-0">{name}</h3>
            
            <div className="flex-grow overflow-y-auto my-4 pr-2">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-left">{explanation}</p>
            </div>
            
            <div className="pt-4 flex-shrink-0">
                <button 
                    onClick={onClose}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                >
                    Fermer
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default AssociationDetailModal;