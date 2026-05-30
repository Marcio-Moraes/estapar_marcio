"use client";

import { useGarages } from "@/hooks/useGarages";
import { BotaoActivate } from "./botaoActivate";

export const BarraInfoMensalistas = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filterActiveOnly, 
    setFilterActiveOnly, 
    filteredGarages 
  } = useGarages();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-150 rounded-2xl bg-white mt-8 p-4 w-full shadow-xs">
      <div className="flex items-center justify-center md:justify-start gap-3 font-semibold text-gray-700 w-full md:w-auto">
        <BotaoActivate 
          isActive={filterActiveOnly} 
          onToggle={() => setFilterActiveOnly(!filterActiveOnly)} 
        />
        <span>Apenas Ativos</span>
      </div>
      <div className="text-gray-500 text-sm w-full md:w-auto text-center font-medium">
        {filteredGarages.length} registro{filteredGarages.length !== 1 ? 's' : ''} encontrado{filteredGarages.length !== 1 ? 's' : ''}
      </div>
      <div className="w-full md:w-auto flex justify-end">
        <input 
          type="text" 
          placeholder="Buscar garagem por nome ou código..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full md:w-[320px] rounded-xl px-4 py-2 text-sm transition-all"
        />
      </div>
    </div>
  );
};