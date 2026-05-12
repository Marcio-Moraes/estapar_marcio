import { BarraInfoMensalistas } from "@/components/layout/barraInfoMensalistas";
import { BarraUserTopo } from "@/components/layout/barraUserTopo"
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import Image from "next/image";

export default function Garagens() {
  return (
    <div className="bg-white h-screen w-screen p-8">
      <BarraUserTopo />

      <div className="flex gap-1">
        <Image src={iconGaragem} alt="Dashboard" width={40} height={30} />
        <h1 className="text-2xl font-bold">Garagens</h1>
      </div>
      
      <p className="text-gray-600">Visualize as garagens habilitadas para mensalistas digitais</p>

      <BarraInfoMensalistas />

      <table className="border border-gray-200 p-4 mt-6 rounded-lg w-full table-fixed">
        <thead className="rounded-t-lg">
          <tr className="text-gray-600 border-b border-gray-200 p-2 text-left">
            <th className="p-2 rounded-tl-lg w-[100px]">Código</th>
            <th className="p-2">Nome</th>
            <th className="p-2 hidden md:table-cell">Endereço</th>
            <th className="p-2 hidden md:table-cell">Cidade/UF</th>
            <th className="p-2 hidden md:table-cell">Regional</th>
            <th className="p-2 rounded-tr-lg">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 w-[100px]">000610</td>
            <td className="p-2">ACYR DE ANDRADE (GMC PARK)</td>
            <td className="p-2 hidden md:table-cell">RUA JOAQUIM FLORIANO, 620</td>
            <td className="p-2 hidden md:table-cell">SÃO PAULO/SP</td>
            <td className="p-2 hidden md:table-cell">SP 1</td>
            <td className="p-2">
              <button>Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}