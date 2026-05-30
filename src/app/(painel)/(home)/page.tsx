import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import Link from "next/link";
import { LuCar, LuBuilding2 } from "react-icons/lu";

export default function Home() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col">
      <BarraUserTopo />

      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center py-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-gray-900 text-3xl md:text-4xl font-extrabold tracking-tight">
            Portal Estapar <span className="text-[#7AD33E]">B2B</span>
          </h1>
          <p className="text-gray-500 mt-4 text-base md:text-lg font-medium leading-relaxed">
            Gerencie seus serviços de estacionamento, acesse relatórios, configure credenciados e contrate planos de mensalidade em um só lugar com eficiência e agilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          <Link 
            href="/garagens" 
            className="group bg-white hover:bg-[#7AD33E]/5 border border-gray-150 hover:border-[#7AD33E]/30 rounded-2xl p-8 transition-all duration-300 shadow-xxs hover:shadow-md flex flex-col items-center text-center"
          >
            <div className="p-4 bg-[#7AD33E]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <LuBuilding2 className="text-5xl text-[#7AD33E]" />
            </div>
            <h2 className="text-gray-900 text-xl font-bold mt-6 group-hover:text-[#5fa530] transition-colors">
              Garagens
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Consulte a lista de garagens credenciadas, configure limites de vagas, planos ativos, cupons de desconto e parametrize configurações locais.
            </p>          
          </Link>

          <Link 
            href="/mensalistas" 
            className="group bg-white hover:bg-[#7AD33E]/5 border border-gray-150 hover:border-[#7AD33E]/30 rounded-2xl p-8 transition-all duration-300 shadow-xxs hover:shadow-md flex flex-col items-center text-center"
          >
            <div className="p-4 bg-[#7AD33E]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <LuCar className="text-5xl text-[#7AD33E]" />
            </div>
            <h2 className="text-gray-900 text-xl font-bold mt-6 group-hover:text-[#5fa530] transition-colors">
              Mensalistas
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Cadastre novos clientes mensalistas vinculando-os a garagens específicas, defina planos ativos e controle suspensões e ativações.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
