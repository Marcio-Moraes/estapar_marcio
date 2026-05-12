"use client";

import { useState } from "react";
import { BotaoActivate } from "./botaoActivate";

export const BarraInfoMensalistas = () => {
    const [searchTerm, setSearchTerm] = useState(true);
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200 rounded-lg mt-10 p-4 w-full">
      <div className="flex items-center justify-center md:justify-start gap-2 font-bold w-full">
        <BotaoActivate />
        Mensalistas Digital
      </div>
      <div className="text-gray-600 w-full text-center">
        25 registros
      </div>
      <div className="w-full flex justify-end">
        <input 
          type="text" 
          placeholder="Buscar por nome" 
          className="border border-gray-300 w-full md:max-w-[300px] rounded px-3 py-2"
        />
      </div>
    </div>
  );
};