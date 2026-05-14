
import { InputHTMLAttributes } from "react";

type inputPopupProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    placeholder: string;
}

export const InputPopup = ({label, id, placeholder, ...props}: inputPopupProps) => {
    return (
        <div>
            <label 
                htmlFor={id || ''}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input 
                type="text" 
                placeholder={placeholder} 
                {...props} 
                className="border border-gray-300 rounded px-2 py-1 w-full"
            />
        </div>
    );
};