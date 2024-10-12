// src/app/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import '../styles/globals.css';


const HomePage: React.FC = () => {
  // Redirect to login page when the root URL is accessed
  redirect('/login');

  return null; // This will never be reached due to the redirect
};

export default HomePage;
