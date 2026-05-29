"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LuUser } from "react-icons/lu";
import { TbLockPassword, TbLoader2 } from "react-icons/tb";

export const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm max-w-md w-full">
      <h2 className="text-[#1E293B] font-extrabold text-xl mb-1">Acesso ao Portal</h2>
      <p className="text-gray-500 mb-6 text-sm">Entre com suas credenciais para gerenciar garagens e mensalistas</p>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl mb-5 text-sm font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="text-[#334155] font-semibold text-sm mb-1.5 block">
            Usuário:
          </label>
          <div className="relative">
            <LuUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/20 outline-none rounded-xl py-2.5 pl-10 pr-4 w-full transition-all text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-[#334155] font-semibold text-sm mb-1.5 block">
            Senha:
          </label>
          <div className="relative">
            <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/20 outline-none rounded-xl py-2.5 pl-10 pr-4 w-full transition-all text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer bg-[#7AD33E] hover:bg-[#6ec236] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          {loading ? (
            <>
              <TbLoader2 className="animate-spin" size={18} />
              Autenticando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
};
