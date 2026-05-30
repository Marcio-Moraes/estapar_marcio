"use client";

import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Mensalista } from "@/types";
import { mensalistaService } from "@/services/mensalistaService";

interface MensalistaContextType {
  mensalistas: Mensalista[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMensalistas: Mensalista[];
  fetchMensalistas: () => Promise<void>;
  addMensalista: (mensalistaData: Omit<Mensalista, "id">) => Promise<Mensalista>;
  updateMensalista: (id: string, data: Partial<Mensalista>) => Promise<Mensalista>;
}

export const MensalistaContext = createContext<MensalistaContextType | undefined>(undefined);

export const MensalistaProvider = ({ children }: { children: ReactNode }) => {
  const [mensalistas, setMensalistas] = useState<Mensalista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMensalistas = async () => {
    try {
      setLoading(true);
      const data = await mensalistaService.getMensalistas();
      setMensalistas(data);
    } catch (error) {
      console.error("Erro ao carregar mensalistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensalistas();
  }, []);

  const addMensalista = async (mensalistaData: Omit<Mensalista, "id">) => {
    try {
      const newMensalista = await mensalistaService.createMensalista(mensalistaData);
      setMensalistas((prev) => [...prev, newMensalista]);
      return newMensalista;
    } catch (error) {
      console.error("Erro ao criar mensalista:", error);
      throw error;
    }
  };

  const updateMensalista = async (id: string, data: Partial<Mensalista>) => {
    try {
      const updated = await mensalistaService.updateMensalista(id, data);
      setMensalistas((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } catch (error) {
      console.error(`Erro ao atualizar mensalista ${id}:`, error);
      throw error;
    }
  };

  const filteredMensalistas = useMemo(() => {
    return mensalistas.filter((mensalista) => {
      const query = searchTerm.toLowerCase();
      return (
        mensalista.nome.toLowerCase().includes(query) ||
        mensalista.cpf.includes(query) ||
        mensalista.email.toLowerCase().includes(query) ||
        mensalista.garagemNome.toLowerCase().includes(query)
      );
    });
  }, [mensalistas, searchTerm]);

  return (
    <MensalistaContext.Provider
      value={{
        mensalistas,
        loading,
        searchTerm,
        setSearchTerm,
        filteredMensalistas,
        fetchMensalistas,
        addMensalista,
        updateMensalista,
      }}
    >
      {children}
    </MensalistaContext.Provider>
  );
};

// Wait! At line 95, there is a typo: it says </AuthContext.Provider> instead of </MensalistaContext.Provider>! Let's be very careful to fix that immediately in the file content.
// Yes, let's write it down correctly: </MensalistaContext.Provider>.
