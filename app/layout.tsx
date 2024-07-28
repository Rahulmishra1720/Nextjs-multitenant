// app/layout.js
import { ReactNode } from 'react';
import ClientWrapper from './components/clientWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body style={{ margin: '0', padding: '0', height: '100%', display: 'block' }}>
        <ClientWrapper>
          <div >
            {children}
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
