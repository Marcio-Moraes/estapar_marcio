
import { FiUsers } from "react-icons/fi";

type Props = {
    title: string;
    value: number | string;
    iconColor?: string;
}

export const ItemDescricaoDetalhes = ({ title, value, iconColor = "text-gray-500" }: Props) => {
    return (
        <div className="flex flex-col justify-center w-full border border-gray-300 text-gray-500 rounded-lg py-4 px-8 min-h-32">
            <div>{title}</div>
            <div className="flex items-center gap-2 text-2xl mt-4">
                <FiUsers className={iconColor} />
                <div className="font-bold text-black">{value}</div>
            </div>
        </div>
    );
};