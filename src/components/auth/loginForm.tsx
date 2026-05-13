"use client";

import { LuUser } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";

export const LoginForm = () => {
  return (
    <div className="bg-white p-7 border border-gray-200 rounded-lg">
        <p className="text-gray-600 mb-6 text-[#394152] font-bold">Entre com suas credenciais para acessar o sistema</p>
        <form action="#" className="flex flex-col">
        <label htmlFor="username" className="text-[#394152] font-bold mb-1">Usuário:</label>

        <div className="relative">
          <LuUser className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400" />
          <input type="text" id="username" className="border border-gray-300 rounded-lg p-2 mb-6 pl-10 w-full" />
        </div>

        <label htmlFor="password" className="text-[#394152] font-bold mb-1">Senha:</label>

        <div className="relative">
          <TbLockPassword className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400" />
          <input type="password" id="password" className="border border-gray-300 rounded-lg p-2 mb-6 pl-10 w-full" />
        </div>

        <button 
            type="submit" 
            className="cursor-pointer bg-[#7AD33E] text-white px-4 py-2 rounded-lg"
        >
            Entrar
        </button>
        </form>
    </div>
  );
}
