import { Mensalista } from "@/types";

const LOCAL_STORAGE_KEY = "estapar_mensalistas_data";

const initialMensalistas: Mensalista[] = [
  {
    id: "m-1",
    nome: "Carlos Eduardo Silva",
    email: "carlos.silva@gmail.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    garagemCodigo: "000610",
    garagemNome: "ACYR DE ANDRADE (GMC PARK)",
    planoId: "000610-p1",
    planoDescricao: "Plano Mensal Standard",
    ativo: true,
  },
  {
    id: "m-2",
    nome: "Ana Carolina Santos",
    email: "ana.carol@outlook.com",
    telefone: "(11) 97654-3210",
    cpf: "987.654.321-11",
    garagemCodigo: "000610",
    garagemNome: "ACYR DE ANDRADE (GMC PARK)",
    planoId: "000610-p2",
    planoDescricao: "Plano Mensal Executivo",
    ativo: true,
  },
  {
    id: "m-3",
    nome: "Roberto de Souza",
    email: "roberto.souza@yahoo.com.br",
    telefone: "(11) 96543-2109",
    cpf: "456.789.123-22",
    garagemCodigo: "000615",
    garagemNome: "ESTACIONAMENTO BERRINI",
    planoId: "000615-p1",
    planoDescricao: "Plano Mensal Standard",
    ativo: false,
  },
];

const getMensalistasList = (): Mensalista[] => {
  if (typeof window === "undefined") return initialMensalistas;

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Mensalista[];
    } catch {
      // Fallback
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMensalistas));
  return initialMensalistas;
};

export const mensalistaService = {
  async getMensalistas(): Promise<Mensalista[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMensalistasList();
  },

  async createMensalista(mensalistaData: Omit<Mensalista, "id">): Promise<Mensalista> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const mensalistas = getMensalistasList();

    const newMensalista: Mensalista = {
      ...mensalistaData,
      id: `m-${Date.now()}`,
    };

    const updated = [...mensalistas, newMensalista];
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    return newMensalista;
  },

  async updateMensalista(id: string, data: Partial<Mensalista>): Promise<Mensalista> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mensalistas = getMensalistasList();
    const index = mensalistas.findIndex(m => m.id === id);

    if (index === -1) throw new Error("Mensalista não encontrado.");

    const updatedMensalista = {
      ...mensalistas[index],
      ...data,
    };

    mensalistas[index] = updatedMensalista;
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mensalistas));
    }

    return updatedMensalista;
  }
};
