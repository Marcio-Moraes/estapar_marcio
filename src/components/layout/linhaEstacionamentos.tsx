import Link from "next/link";
import { GrView } from "react-icons/gr";

type Props = {
  codigo: string;
  nome: string;
  endereco: string;
  cidadeUf: string;
  regional: string;
  ativo?: boolean;
}

export const LinhaEstacionamentos = ({ codigo, nome, endereco, cidadeUf, regional, ativo = true }: Props) => {
  return (
    <div className="flex items-center py-4 hover:bg-gray-50/50 transition-colors border-b border-gray-100 text-sm text-gray-600">
      <div className="w-[100px] font-bold text-gray-900">{codigo}</div>
      <div className="flex-1 font-semibold text-gray-800 pr-4">{nome}</div>
      <div className="hidden lg:block flex-1 text-gray-500 pr-4">{endereco}</div>
      <div className="hidden xl:block flex-1 text-gray-500 pr-4">{cidadeUf}</div>
      <div className="hidden xl:block flex-1 text-gray-500 pr-4">{regional}</div>
      
      <div className="w-[80px] text-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          ativo 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-gray-50 text-gray-500 border border-gray-200"
        }`}>
          {ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="flex items-center justify-end w-[60px] pr-2">
        <Link 
          href={`/garagens/${codigo}`} 
          className="cursor-pointer p-2 text-[#7AD33E] hover:bg-[#7AD33E]/10 rounded-xl transition-all text-center flex items-center justify-center"
          title="Visualizar detalhes"
        >
          <GrView size={16} />
        </Link>
      </div>
    </div>
  );
};