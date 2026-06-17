'use client';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in failed</h1>
        <p className="text-gray-500 text-sm mb-6">Something went wrong with Google sign in. Please try again.</p>
        <Link href="/" className="px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}