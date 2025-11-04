'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import SubscribeModal from '@/components/common/SubscribeModal';
import { MessageResponse } from '@/utils/enum';

interface SubscribeModalContextType {
  showSubscribeModal: (message: string, description?: string) => void;
  hideSubscribeModal: () => void;
}

const SubscribeModalContext = createContext<SubscribeModalContextType | undefined>(undefined);

export function SubscribeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [messageType, setMessageType] = useState<'invalid' | 'expired'>('invalid');

  const showSubscribeModal = (message: string, description?: string) => {
    // Determine message type based on the message value
    const isExpired = message === MessageResponse.ExpiredLicenseId;
    setMessageType(isExpired ? 'expired' : 'invalid');
    setDescription(description || '');
    setIsOpen(true);
  };

  const hideSubscribeModal = () => {
    setIsOpen(false);
    setDescription('');
  };

  return (
    <SubscribeModalContext.Provider value={{ showSubscribeModal, hideSubscribeModal }}>
      {children}
      <SubscribeModal
        isOpen={isOpen}
        onClose={hideSubscribeModal}
        description={description}
        messageType={messageType}
      />
    </SubscribeModalContext.Provider>
  );
}

export function useSubscribeModal() {
  const context = useContext(SubscribeModalContext);
  if (context === undefined) {
    throw new Error('useSubscribeModal must be used within a SubscribeModalProvider');
  }
  return context;
}

