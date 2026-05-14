import { InputPopup } from "./inputPopup";

export const Popup = () => {
    return (
        <div className="bg-gray-200 w-full h-full flex items-center justify-center ">
            <div className="max-w-sm bg-red-400">
                <div>
                    <h1>Popup</h1>
                    <p>Preencha os dados para criar um novo plano.</p>
                </div>

                <div>
                    <InputPopup label="Nome" placeholder="Nome" />
                </div>
            </div>
        </div>
    );
};