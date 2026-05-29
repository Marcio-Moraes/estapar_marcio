"use client";

import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Garage } from "@/types";
import { garageService } from "@/services/garageService";

interface GarageContextType {
  garages: Garage[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterActiveOnly: boolean;
  setFilterActiveOnly: (activeOnly: boolean) => void;
  filteredGarages: Garage[];
  fetchGarages: () => Promise<void>;
  addGarage: (garageData: Omit<Garage, "planos" | "descontos" | "vagasTotais" | "vagasOcupadas" | "vagasDisponiveis" | "acoes">) => Promise<Garage>;
  updateGarage: (codigo: string, data: Partial<Garage>) => Promise<Garage>;
  toggleGarageStatus: (codigo: string) => Promise<void>;
}

export const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider = ({ children }: { children: ReactNode }) => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const fetchGarages = async () => {
    try {
      setLoading(true);
      const data = await garageService.getGarages();
      setGarages(data);
    } catch (error) {
      console.error("Erro ao carregar garagens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  const addGarage = async (garageData: Omit<Garage, "planos" | "descontos" | "vagasTotais" | "vagasOcupadas" | "vagasDisponiveis" | "acoes">) => {
    try {
      const newGarage = await garageService.createGarage(garageData);
      setGarages((prev) => [...prev, newGarage]);
      return newGarage;
    } catch (error) {
      console.error("Erro ao criar garagem:", error);
      throw error;
    }
  };

  const updateGarage = async (codigo: string, data: Partial<Garage>) => {
    try {
      const updatedGarage = await garageService.updateGarage(codigo, data);
      setGarages((prev) =>
        prev.map((g) => (g.codigo === codigo ? updatedGarage : g))
      );
      return updatedGarage;
    } catch (error) {
      console.error(`Erro ao atualizar garagem ${codigo}:`, error);
      throw error;
    }
  };

  const toggleGarageStatus = async (codigo: string) => {
    try {
      const updatedGarage = await garageService.toggleGarageStatus(codigo);
      setGarages((prev) =>
        prev.map((g) => (g.codigo === codigo ? updatedGarage : g))
      );
    } catch (error) {
      console.error(`Erro ao alternar status da garagem ${codigo}:`, error);
      throw error;
    }
  };

  // Perform search and filter computations using useMemo
  const filteredGarages = useMemo(() => {
    return garages.filter((garage) => {
      const matchesSearch =
        garage.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.codigo.includes(searchTerm) ||
        garage.endereco.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesActive = filterActiveOnly ? garage.ativo : true;

      return matchesSearch && matchesActive;
    });
  }, [garages, searchTerm, filterActiveOnly]);

  return (
    <GarageContext.Provider
      value={{
        garages,
        loading,
        searchTerm,
        setSearchTerm,
        filterActiveOnly,
        setFilterActiveOnly,
        filteredGarages,
        fetchGarages,
        addGarage,
        updateGarage,
        toggleGarageStatus,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};
