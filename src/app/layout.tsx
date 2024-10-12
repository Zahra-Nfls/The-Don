'use client';

import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Ensure global styles are included
import Image from 'next/image';
import logo from '../assets/img/OIG1.jpeg'; // Assuming logo is in the assets folder

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="w-full min-h-screen flex flex-col">
            <header className="bg-black flex items-center justify-start">
              <Image className="w-40" src={logo} alt="logo" />
            </header>
            <main >{children}</main> {/* Flex-grow makes the main content fill available space */}
            <footer className="bg-black p-4 text-center text-white  bottom-0 center-0 w-full fixed">
              © 2024 -𝚃𝚑𝚎 𝙳𝚘𝚗-
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
