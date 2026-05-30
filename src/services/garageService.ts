import { Garage, Plan, Discount } from "@/types";
import { data as rawMockData } from "@/data";

const LOCAL_STORAGE_KEY = "estapar_garages_data";

// Helper to generate some default plans for seed garages
const generateSeedPlans = (codigo: string): Plan[] => {
  return [
    {
      id: `${codigo}-p1`,
      descricao: "Plano Mensal Standard",
      valor: 350.0,
      vagas: 35,
      ocupadas: 12,
      disponiveis: 23,
      ativo: true,
    },
    {
      id: `${codigo}-p2`,
      descricao: "Plano Mensal Executivo",
      valor: 500.0,
      vagas: 15,
      ocupadas: 8,
      disponiveis: 7,
      ativo: true,
    },
    {
      id: `${codigo}-p3`,
      descricao: "Plano Mensal Moto",
      valor: 180.0,
      vagas: 20,
      ocupadas: 5,
      disponiveis: 15,
      ativo: false,
    }
  ];
};

// Helper to generate some default discounts for seed garages
const generateSeedDiscounts = (codigo: string): Discount[] => {
  return [
    {
      id: `${codigo}-d1`,
      cupom: "ESTAPAR10",
      descricao: "Desconto Parcerias 10%",
      descontoPercentual: 10,
      ativo: true,
    },
    {
      id: `${codigo}-d2`,
      cupom: "B2BPROMO",
      descricao: "Convênio Corporativo",
      descontoPercentual: 15,
      ativo: false,
    }
  ];
};

const getInitialGarages = (): Garage[] => {
  if (typeof window === "undefined") {
    return rawMockData.mensalistas.map(m => ({
      ...m,
      vagasTotais: 70,
      vagasOcupadas: 25,
      vagasDisponiveis: 45,
      planos: generateSeedPlans(m.codigo),
      descontos: generateSeedDiscounts(m.codigo)
    }));
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Garage[];
    } catch {
      // Fallback if JSON parse fails
    }
  }

  // Seed data
  const seeded = rawMockData.mensalistas.map(m => {
    const plans = generateSeedPlans(m.codigo);
    const discounts = generateSeedDiscounts(m.codigo);
    const vagasTotais = plans.reduce((acc, p) => acc + (p.ativo ? p.vagas : 0), 0);
    const vagasOcupadas = plans.reduce((acc, p) => acc + (p.ativo ? p.ocupadas : 0), 0);
    const vagasDisponiveis = vagasTotais - vagasOcupadas;

    return {
      ...m,
      vagasTotais,
      vagasOcupadas,
      vagasDisponiveis,
      planos: plans,
      descontos: discounts
    };
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const garageService = {
  async getGarages(): Promise<Garage[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getInitialGarages();
  },

  async getGarageByCode(codigo: string): Promise<Garage | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const garages = getInitialGarages();
    return garages.find(g => g.codigo === codigo) || null;
  },

  async createGarage(garageData: Omit<Garage, "planos" | "descontos" | "vagasTotais" | "vagasOcupadas" | "vagasDisponiveis" | "acoes">): Promise<Garage> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const garages = getInitialGarages();

    // Check duplicate code
    if (garages.some(g => g.codigo === garageData.codigo)) {
      throw new Error(`Já existe um estacionamento cadastrado com o código ${garageData.codigo}.`);
    }

    const defaultPlans = generateSeedPlans(garageData.codigo);
    const defaultDiscounts = generateSeedDiscounts(garageData.codigo);
    const vagasTotais = defaultPlans.reduce((acc, p) => acc + (p.ativo ? p.vagas : 0), 0);
    const vagasOcupadas = defaultPlans.reduce((acc, p) => acc + (p.ativo ? p.ocupadas : 0), 0);
    const vagasDisponiveis = vagasTotais - vagasOcupadas;

    const newGarage: Garage = {
      ...garageData,
      vagasTotais,
      vagasOcupadas,
      vagasDisponiveis,
      planos: defaultPlans,
      descontos: defaultDiscounts,
      acoes: {
        link: `/garagens/${garageData.codigo}`,
        urlCurta: `estapar.app/g${garageData.codigo}`
      }
    };

    const updated = [...garages, newGarage];
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    return newGarage;
  },

  async updateGarage(codigo: string, data: Partial<Garage>): Promise<Garage> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const garages = getInitialGarages();
    const index = garages.findIndex(g => g.codigo === codigo);

    if (index === -1) {
      throw new Error("Estacionamento não encontrado.");
    }

    // Preserve key arrays/values if not sent in partial update
    const existing = garages[index];
    const updatedGarage: Garage = {
      ...existing,
      ...data,
      // Ensure key relations are updated properly if passed, else kept
      planos: data.planos || existing.planos,
      descontos: data.descontos || existing.descontos,
    };

    // Recompute vacancies totals if plans updated
    if (data.planos) {
      const activePlans = updatedGarage.planos.filter(p => p.ativo);
      updatedGarage.vagasTotais = activePlans.reduce((acc, p) => acc + p.vagas, 0);
      updatedGarage.vagasOcupadas = activePlans.reduce((acc, p) => acc + p.ocupadas, 0);
      updatedGarage.vagasDisponiveis = updatedGarage.vagasTotais - updatedGarage.vagasOcupadas;
    }

    garages[index] = updatedGarage;

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(garages));
    }

    return updatedGarage;
  },

  async toggleGarageStatus(codigo: string): Promise<Garage> {
    const garages = getInitialGarages();
    const garage = garages.find(g => g.codigo === codigo);
    if (!garage) throw new Error("Estacionamento não encontrado.");
    
    return this.updateGarage(codigo, { ativo: !garage.ativo });
  }
};
