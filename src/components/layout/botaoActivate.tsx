
"use client";

interface BotaoActivateProps {
  isActive: boolean;
  onToggle: () => void;
}

export const BotaoActivate = ({ isActive, onToggle }: BotaoActivateProps) => {
  return (
    <div 
      className={`w-14 h-8 flex items-center ${isActive ? 'justify-end' : 'justify-start'} rounded-full p-1 cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#7AD33E]' : 'bg-gray-200'}`}
      onClick={onToggle}            
    >
      <div className="w-6 h-6 rounded-full bg-white shadow-xs"></div>
    </div>
  );
};