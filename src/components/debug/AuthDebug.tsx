'use client';

import { tokenStorage } from '@/lib/auth-storage';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      isAuthenticated: tokenStorage.isAuthenticated(),
      userSession: tokenStorage.getUserSession(),
      rememberMe: tokenStorage.getRememberMe(),
      userId: tokenStorage.getUserId(),
      userRole: tokenStorage.getUserRole(),
      permissions: tokenStorage.getUserPermissions(),
      shouldRefresh: tokenStorage.shouldRefreshToken(),
    };
    setDebugInfo(info);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-40">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
















