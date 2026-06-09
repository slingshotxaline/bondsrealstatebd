'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from '../components/Login/LoginModal';
import RegisterModal from '../components/RegisterModal/RegisterModal';


const PROTECTED_PREFIXES = [
  '/property-buy-sell',
  '/services',
  '/development',
];

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');

  useEffect(() => {
    const isProtected = PROTECTED_PREFIXES.some(prefix =>
      pathname.startsWith(prefix)
    );

    setShowModal(isProtected);

    if (isProtected) {
      setModalType('login');
    }
  }, [pathname]);

  return (
    <AuthModalContext.Provider
      value={{
        showModal,
        setShowModal,
        modalType,
        setModalType,
      }}
    >
      {children}

      {showModal && modalType === 'login' && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSwitchToRegister={() => setModalType('register')}
        />
      )}

      {showModal && modalType === 'register' && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSwitchToLogin={() => setModalType('login')}
        />
      )}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);