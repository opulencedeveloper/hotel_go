'use client';

import { tokenStorage } from '@/lib/auth-storage';
import { useRouter } from 'next/navigation';

export default function ClearCookies() {
  const router = useRouter();

  const clearAllAuth = () => {
    // Clear client-side session data
    tokenStorage.clearUserSession();
    
    // Clear all cookies (including httpOnly ones via server)
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Redirect to login
    router.push('/login');
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white p-2 rounded">
      <button 
        onClick={clearAllAuth}
        className="text-xs font-bold"
      >
        Clear Auth & Reload
      </button>
    </div>
  );
}














