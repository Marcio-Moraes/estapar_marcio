"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GarageProvider } from "@/context/GarageContext";
import { MensalistaProvider } from "@/context/MensalistaContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <GarageProvider>
        <MensalistaProvider>{children}</MensalistaProvider>
      </GarageProvider>
    </AuthProvider>
  );
};
