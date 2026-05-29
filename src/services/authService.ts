import { User } from "@/types";

const SESSION_KEY = "estapar_user_session";

export const authService = {
  async login(username: string, password: string): Promise<User> {
    // Simulating API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!username || !password) {
      throw new Error("Usuário e senha são obrigatórios.");
    }

    // Mock validation
    if (password.length < 4) {
      throw new Error("A senha deve ter pelo menos 4 caracteres.");
    }

    const mockUser: User = {
      id: "u-1",
      nome: username.toLowerCase() === "marcio" ? "Márcio Moraes" : username,
      email: `${username.toLowerCase()}@estapar.com.br`,
      username: username,
      cargo: "Gestor Regional",
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
    }

    return mockUser;
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;
    
    const session = sessionStorage.getItem(SESSION_KEY);
    if (!session) return null;

    try {
      return JSON.parse(session) as User;
    } catch {
      return null;
    }
  }
};
