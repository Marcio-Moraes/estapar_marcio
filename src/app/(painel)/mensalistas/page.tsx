
import { BarraUserTopo } from "@/components/layout/barraUserTopo"
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import Image from "next/image";

export default function Mensalistas() {
  return (
    <div className="bg-white h-screen w-screen p-8">
      <BarraUserTopo />

      <div className="flex gap-1">
        <Image src={iconGaragem} alt="Dashboard" width={40} height={30} />
        <h1 className="text-2xl font-bold">Mensalistas</h1>
      </div>
      
      <p className="text-gray-600">Visualize os mensalistas cadastrados</p>
      
    </div>
  );
}