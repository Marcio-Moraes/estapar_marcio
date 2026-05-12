import Image from "next/image";
import iconUsuario from "@/assets/ui/icon-usuario.png";

export const BarraUserTopo = () => {
  return (
    <div className="flex justify-end w-full mb-4 py-2 px-1">
      <ul className="flex gap-4">
        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Image src={iconUsuario} alt="User" width={18} height={18} />
          Márcio Moraes
        </li>
        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Image src={iconUsuario} alt="User" width={18} height={18} />
          Sair
        </li>
      </ul>
    </div>
  );
};