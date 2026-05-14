
"use client";

import { useState } from "react";

export const BotaoActivate = ({clickFunction}: {clickFunction: () => void}) => {
    const [searchTerm, setSearchTerm] = useState(true);

    function handleClick() {
        console.log('BotaoActivate clicado');
        setSearchTerm(!searchTerm)  
        clickFunction()      
    }

    return (
        <div 
            className={`w-16 h-9 flex items-center  ${searchTerm ? 'justify-end' : 'justify-start'} rounded-full p-1 cursor-pointer ${searchTerm ? 'bg-[#7AD33E]' : 'bg-gray-300'}`}
            onClick={handleClick}            
        >
          <div className="w-7 h-7 rounded-full bg-white"></div>
        </div>
    );
};