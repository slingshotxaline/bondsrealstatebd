'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function AuthCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { loadUser } = useAuth();

  useEffect(() => {
    const token        = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (!token) {
      router.replace('/');
      return;
    }

    // Store tokens
    localStorage.setItem('bonds_token',   token);
    localStorage.setItem('bonds_refresh', refreshToken || '');

    // Reload user from API then redirect
    loadUser().then(() => {
      const role = searchParams.get('role');
      router.replace(role === 'user' ? '/dashboard' : '/admin');
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#004835] flex items-center justify-center">
          <Loader2 size={22} className="text-white animate-spin" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Signing you in with Google...</p>
      </div>
    </div>
  );
}