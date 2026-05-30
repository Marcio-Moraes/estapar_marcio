"use client";

import { useAuth } from "@/hooks/useAuth";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";

interface BarraUserTopoProps {
  actionLabel?: string;
  onAction?: () => void;
}

export const BarraUserTopo = ({ actionLabel = "Novo", onAction }: BarraUserTopoProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center w-full mb-8 py-2 border-b border-gray-100">
      <div>
        {onAction ? (
          <button 
            onClick={onAction}
            className="cursor-pointer bg-[#7AD33E] hover:bg-[#6ec236] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-xs transition-colors"
          >
            {actionLabel}
          </button>
        ) : (
          <div />
        )}
      </div>

      <ul className="flex items-center gap-6">
        <li className="flex items-center gap-2 text-sm text-gray-700 font-semibold bg-gray-100 px-3.5 py-1.5 rounded-full">
          <LuUser className="text-[#7AD33E]" />
          <span>{user?.nome || "Carregando..."}</span>
        </li>
        <li>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors cursor-pointer bg-transparent border-0"
          >
            <FaArrowRightFromBracket />
            <span className="hidden md:inline">Sair</span>
          </button>
        </li>
      </ul>
    </div>
  );
};