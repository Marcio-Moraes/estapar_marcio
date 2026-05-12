import Image from "next/image";
import iconUsuario from "@/assets/ui/icon-usuario.png";
import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import Link from "next/link";

export default function Home() {
  return (
    // bg-[#F9FAFB]
    <div className="bg-white h-screen w-screen p-8">
      <BarraUserTopo />

      <h1 className="text-gray-800 text-2xl font-bold mt-8 mb-2">Bem vindo ao portal Estapar B2B</h1>
      <p className="text-[#666666]">
        Gerencie seus serviços de estacionamento, acesse relatórios, configure credenciados e contrante planos de mensalidade em um só lugar.
      </p>

      <div className="flex gap-8 my-10">
        <Link href="/garagens" className="w-full md:w-1/2 min-h-[200px] border border-gray-200 rounded-lg p-4">
            <Image src={iconGaragem} alt="Dashboard" width={100} height={180} />
            <h2 className="text-gray-800 text-lg font-bold mt-4">Garagens</h2>
            <p>Veja a lista de garagens disponíveis e suas configurações.</p>          
        </Link>
        <Link href="/mensalistas" className="w-full md:w-1/2 min-h-[200px] border border-gray-200 rounded-lg p-4">
            <Image src={iconGaragem} alt="Dashboard" width={100} height={180} />
            <h2 className="text-gray-800 text-lg font-bold mt-4">Mensalistas</h2>
            <p>Contrate vagas adicionais para seus funcionários ou visitantes.</p>
        </Link>
      </div>
    </div>
  );
}
