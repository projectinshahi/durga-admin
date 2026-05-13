"use client";
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppShell from './AppShell';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppShell>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
