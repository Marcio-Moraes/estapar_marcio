"use client"

import Image from "next/image";
import logo from "@/assets/ui/estapar_estacionamentos_logo.png";
import Link from "next/link";
import { LuBuilding2, LuCar } from "react-icons/lu";

export const Sidebar = () => {
  return (
    <div className="w-64 min-h-full w-full md:w-64 bg-[#F9FAFB] py-4 border-r border-gray-200 hidden md:block">
      <div className="flex items-center justify-center border-b border-gray-200" >
        <Link href="/">
          <Image src={logo} loading="lazy" alt="Logo" width={150} height={100} className="mx-auto object-contain mt-2 mb-6" />
        </Link>
      </div>

      <ul className="flex flex-col gap-2 pt-8">
        <li>
          <Link href="/garagens" className="bg-white hover:bg-[#F4F4F5] flex px-8 py-3 rounded-lg">
            <LuBuilding2 size={20} className="mr-2" />
            Garagens
          </Link>
        </li>
        <li>
          <Link href="/mensalistas" className="bg-white hover:bg-[#F4F4F5] flex px-8 py-3 rounded-lg">
            <LuCar size={20} className="mr-2" />
            Mensalistas
          </Link>
        </li>
      </ul>
    </div>
  );
};