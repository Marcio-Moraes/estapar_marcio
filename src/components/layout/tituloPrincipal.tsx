"use client"

import iconGaragem from "@/assets/ui/garagens-icon1.png";
import Image from "next/image";

type Props = {
    titulo: string;
    imageUrl?: string;
}

export const TituloPrincipal = ({ titulo, imageUrl }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <Image src={imageUrl || iconGaragem} alt="Dashboard" width={40} height={30} />
        <h1 className="text-xl md:text-2xl font-bold">{titulo}</h1>
      </div>
    </div>
  )
}

export default TituloPrincipal