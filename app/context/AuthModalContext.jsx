'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from '../components/Login/LoginModal';

const PROTECTED_PREFIXES = [
  '/property-buy-sell',
  '/services',
  '/development',
];

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const pathname = usePathname();

  const isProtected = useMemo(() => {
    return PROTECTED_PREFIXES.some(prefix =>
      pathname.startsWith(prefix)
    );
  }, [pathname]);

  const [showModal, setShowModal] = useState(isProtected);

  return (
    <AuthModalContext.Provider value={{ showModal, setShowModal }}>
      {children}
      {showModal && (
        <LoginModal onClose={() => setShowModal(false)} />
      )}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);



// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { usePathname } from 'next/navigation';
// import LoginModal from '../components/Login/LoginModal';

// const PROTECTED_PREFIXES = [
//   '/property-buy-sell',
//   '/services',
//   '/development',
// ];

// const AuthModalContext = createContext(null);

// export function AuthModalProvider({ children }) {
//   const pathname = usePathname();

//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const isProtected = PROTECTED_PREFIXES.some(prefix =>
//       pathname.startsWith(prefix)
//     );

//     // async state update avoids eslint warning
//     const timer = setTimeout(() => {
//       setShowModal(isProtected);
//     }, 0);

//     return () => clearTimeout(timer);
//   }, [pathname]);

//   return (
//     <AuthModalContext.Provider
//       value={{ showModal, setShowModal }}
//     >
//       {children}

//       {showModal && (
//         <LoginModal
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </AuthModalContext.Provider>
//   );
// }

// export const useAuthModal = () => useContext(AuthModalContext);