import './globals.css';
import React from 'react';

// Uncomment these lines and the OnchainKitProvider wrapper below when you add your API key:
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// const BASE_ENABLED = !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

export const metadata = {
  title: 'Blocktionary',
  description: 'Learn blockchain terms interactively!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* 
        // When you have your OnchainKit API key and want to enable Base/web3, 
        // uncomment the OnchainKitProvider below and the import statements above:
        {BASE_ENABLED ? (
          <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}>
            {children}
          </OnchainKitProvider>
        ) : (
          <>{children}</>
        )}
        */}
        {children}
      </body>
    </html>
  );
}

