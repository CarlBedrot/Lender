import { ReactNode } from 'react';
import { Header } from './Header';

interface MobileContainerProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function MobileContainer({
  children,
  showHeader = true,
}: MobileContainerProps) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-black flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
