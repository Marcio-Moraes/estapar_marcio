import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";

type Props = {
    codigo: string;
    nome: string;
    endereco: string;
    cidadeUf: string;
    regional: string;
}

export const LinhaEstacionamentos = ({codigo, nome, endereco, cidadeUf, regional}: Props) => {
    return (
        <div className="flex items-center border-t border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-[100px]">{codigo}</div>
            <div className="flex-1 font-medium">{nome}</div>
            <div className="hidden md:block flex-1">{endereco}</div>
            <div className="hidden md:block flex-1">{cidadeUf}</div>
            <div className="hidden md:block flex-1">{regional}</div>
            <div className="text-right">
            <Link href={`/garagens/${codigo}`} className="cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors">
                <FaRegEdit />
            </Link>
            </div>
        </div>
    );
};