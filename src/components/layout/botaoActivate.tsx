
"use client";

import { useState } from "react";

export const BotaoActivate = () => {
    const [searchTerm, setSearchTerm] = useState(true);
    return (
        <div 
            className={`w-16 h-9 flex items-center  ${searchTerm ? 'justify-end' : 'justify-start'} rounded-full p-1 cursor-pointer ${searchTerm ? 'bg-[#7AD33E]' : 'bg-gray-300'}`}
            onClick={() => setSearchTerm(!searchTerm)}
        >
          <div className="w-7 h-7 rounded-full bg-white"></div>
        </div>
    );
};