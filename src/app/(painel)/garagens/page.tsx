import { BarraInfoMensalistas } from "@/components/layout/barraInfoMensalistas";
import { BarraUserTopo } from "@/components/layout/barraUserTopo"
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import TituloPrincipal from "@/components/layout/tituloPrincipal";
import { LinhaEstacionamentos } from "@/components/layout/linhaEstacionamentos";
import { data } from "@/data";

export default function Garagens() {
  return (
    <div className="bg-white min-h-screen w-screen p-8">
      <BarraUserTopo />

      <TituloPrincipal titulo="Garagens" imageUrl={iconGaragem.src} />
      
      <p className="text-gray-600">Visualize as garagens habilitadas para mensalistas digitais</p>

      <BarraInfoMensalistas />

      <div className="border border-gray-200 p-4 mt-6 rounded-lg w-full overflow-hidden">
        <div className="flex pb-3 border-b border-gray-200 text-gray-600">
          <div className="w-[100px] font-semibold">Código</div>
          <div className="flex-1 font-semibold">Nome</div>
          <div className="hidden lg:block flex-1 font-semibold">Endereço</div>
          <div className="hidden xl:block flex-1 font-semibold">Cidade/UF</div>
          <div className="hidden xl:block flex-1 font-semibold">Regional</div>
          <div className="font-semibold text-right w-[50px]">Ações</div>
        </div>
        {data.mensalistas.map((mensalista) => (
          <LinhaEstacionamentos 
            key={mensalista.codigo}
            codigo={mensalista.codigo} 
            nome={mensalista.nome} 
            endereco={mensalista.endereco} 
            cidadeUf={mensalista.cidadeUf} 
            regional={mensalista.regional} 
          />
        ))}
      </div>
    </div>
  );
}