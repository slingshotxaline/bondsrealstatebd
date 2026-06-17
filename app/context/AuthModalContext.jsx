'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';  // ← ADD THIS
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
  const { user, loading } = useAuth();  // ← ADD THIS

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');

  useEffect(() => {
    if (loading) return;  // ← wait for auth to resolve first
    if (user) return;     // ← user is logged in → never show modal

    const isProtected = PROTECTED_PREFIXES.some(prefix =>
      pathname.startsWith(prefix)
    );

    if (isProtected) {
      setModalType('login');
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [pathname, user, loading]);  // ← ADD user and loading as dependencies

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