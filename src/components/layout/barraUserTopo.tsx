import { FaArrowRightFromBracket } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";

export const BarraUserTopo = () => {
  return (
    <div className="flex justify-end w-full mb-4 py-2 px-1">
      <ul className="flex gap-4">
        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <LuUser />
          Márcio Moraes
        </li>
        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <FaArrowRightFromBracket />
          Sair
        </li>
      </ul>
    </div>
  );
};