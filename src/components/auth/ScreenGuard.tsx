'use client';

import { ReactNode } from 'react';

interface ScreenGuardProps {
  children: ReactNode;
  screen: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

// ScreenGuard - All users have access to all screens
export const ScreenGuard = ({ 
  children, 
  screen, 
  fallback = null,
  redirectTo = '/dashboard'
}: ScreenGuardProps) => {
  return <>{children}</>;
};

// Hook for checking screen access - Always returns true
export const useScreenAccess = () => {
  const canAccess = (screen: string): boolean => {
    return true;
  };

  return {
    canAccess,
    user: null
  };
};

// Higher-order component for screen-based access - Always allows access
export const withScreenGuard = <P extends object>(
  Component: React.ComponentType<P>,
  screen: string,
  fallback?: ReactNode,
  redirectTo?: string
) => {
  return (props: P) => (
    <ScreenGuard screen={screen} fallback={fallback} redirectTo={redirectTo}>
      <Component {...props} />
    </ScreenGuard>
  );
};





