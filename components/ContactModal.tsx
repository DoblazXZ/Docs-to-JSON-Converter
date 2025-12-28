
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-envelope-open-text text-blue-600"></i>
            {t('contactTitle')}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Body containing Google Form Iframe */}
        <div className="flex-1 w-full bg-gray-50 overflow-hidden relative">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdBm8weAAyIfZV5EaFjt-g9Ti95ZtoL0cI6BVsCfOfts3dVew/viewform?embedded=true" 
            className="absolute inset-0 w-full h-full border-0"
            title="Google Contact Form"
          >
            Yükleniyor…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
