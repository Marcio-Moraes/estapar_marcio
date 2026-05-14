'use server'

import TituloPrincipal from "@/components/layout/tituloPrincipal";
import { LuBuilding, LuCar, LuCircleDollarSign, LuMapPin } from "react-icons/lu";
import { ItemDescricaoDetalhes } from "@/components/layout/garagemDetalhes/itemDescricaoDetalhes";
import { MdQrCode2 } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import { GoGear } from "react-icons/go";
import { data } from "@/data";
import Link from "next/link";

type Props = {
  params: {
    name: string;
  }
}




export default async function GaragemDetail({ params }: { params: { name: string } }) {
  
  const { name } = await params; 
  const mensalista = await data.mensalistas.find(m => m.codigo === name);
  
  
  // caso a url não seja encontrada
  if (!mensalista) {
    return (
      <div className="bg-white h-screen w-screen p-8">
        <TituloPrincipal titulo="Garagem Não Encontrada" />
        <div className="text-center mt-8">
          <p className="text-gray-600">Garagem com código {params.name} não foi encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen w-screen p-8">

      <div>
        <TituloPrincipal titulo={`Garagem - ${mensalista.nome}`} />

        <Link 
          href={`/garagens/`}
          className="font-bold cursor-pointer text-gray-400 hover:text-gray-700 absolute top-4 right-8"
        >
          x
        </Link>
      </div>
      <div>Código: {mensalista.codigo}</div>

      <div className="mt-6 text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <LuMapPin />
          <div className="uppercase">{mensalista.endereco}</div>
        </div>
        <div className="flex items-center gap-2">
          <LuBuilding />
          <div className="uppercase">Filial: <span className="">{mensalista.cidadeUf}</span></div>
        </div>
      </div>

      <div className="bg-gray-300 w-full p-1 mt-8 rounded-t-lg">
        <div className="bg-white py-2 px-8 rounded-t-lg border-b-2 border-green-500 inline-block font-bold">
          Mensalistas Digital
        </div>
      </div>

      <div className="flex flex-col md:flex-row p-2 md:p-4 gap-4 md:gap-6 mt-2 md:mt-4">
        <ItemDescricaoDetalhes title="Total de Vagas" value={35} />
        <ItemDescricaoDetalhes title="Ocupadas" value={0}  iconColor="text-orange-400"/>
        <ItemDescricaoDetalhes title="Disponíveis" value={35} iconColor="text-green-500" />
        
        <div>
          <MdQrCode2 size={148} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full max-w-xs">
          <ul>
            <li className="flex items-center gap-2 w-full h-14 cursor-pointer bg-gray-100 hover:bg-white border border-gray-100 px-6">
              <LuCircleDollarSign />
              <div>Planos</div>
            </li>
            <li className="flex items-center gap-2 w-full h-14 cursor-pointer bg-gray-100 hover:bg-white border border-gray-100 px-6">
              <RiDiscountPercentLine />
              <div>Descontos</div>
            </li>
            <li className="flex items-center gap-2 w-full h-14 cursor-pointer bg-gray-100 hover:bg-white border border-gray-100 px-6">
              <GoGear />
              <div>Configurações</div>
            </li>
            
          </ul>
        </div>
        
        <div className="w-full px-2 md:px-8 py-8">
          <h3 className="font-bold text-lg mb-4">Planos disponíveis</h3>

          <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 flex rounded-t-lg w-full">
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 rounded-tl-lg w-full">Descrição</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-full text-center hidden sm:block">Valor</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-full text-center hidden md:block">Vagas</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-full text-center hidden md:block">Ocupadas</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-full text-center hidden md:block">Disponíveis</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-full text-center hidden md:block">Status</div>
              <div className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 rounded-tr-lg w-full text-center">Ações</div>
            </div>
            <div className="flex hover:bg-gray-50 transition-colors w-full">
              <div className="py-3 px-4 border-b border-gray-200 flex items-center gap-2 w-full">
                <LuCar />
                Plano 1
              </div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center hidden sm:block">R$ 1.003,00</div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center hidden md:block">35</div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center hidden md:block">0</div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center hidden md:block">35</div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center hidden md:block">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ativo
                </span>
              </div>
              <div className="py-3 px-4 border-b border-gray-200 w-full text-center">
                <button className="px-3 py-1 rounded text-sm transition-colors">
                  <FaRegEdit />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};