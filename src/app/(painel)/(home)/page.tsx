import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import Link from "next/link";
import { LuCar, LuBuilding2 } from "react-icons/lu";

export default function Home() {
  return (
    // bg-[#F9FAFB]
    <div className="bg-white h-screen w-screen p-8">
      <BarraUserTopo />

      <h1 className="text-gray-800 text-2xl font-bold mt-8 mb-2">Bem vindo ao portal Estapar B2B</h1>
      <p className="text-[#666666]">
        Gerencie seus serviços de estacionamento, acesse relatórios, configure credenciados e contrante planos de mensalidade em um só lugar.
      </p>

      <div className="flex flex-col md:flex-row gap-8 my-10">
        <Link href="/garagens" className="w-full md:w-1/2 min-h-[200px] border border-gray-200 rounded-lg p-4">
            <LuBuilding2 className="text-6xl text-[#7AD33E]" />
            <h2 className="text-gray-800 text-lg font-bold mt-4">Garagens</h2>
            <p>Veja a lista de garagens disponíveis e suas configurações.</p>          
        </Link>
        <Link href="/mensalistas" className="w-full md:w-1/2 min-h-[200px] border border-gray-200 rounded-lg p-4">
            <LuCar className="text-6xl text-[#7AD33E]" />
            <h2 className="text-gray-800 text-lg font-bold mt-4">Mensalistas</h2>
            <p>Contrate vagas adicionais para seus funcionários ou visitantes.</p>
        </Link>
      </div>
    </div>
  );
}
