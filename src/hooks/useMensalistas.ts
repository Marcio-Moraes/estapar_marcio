import { useContext } from "react";
import { MensalistaContext } from "@/context/MensalistaContext";

export const useMensalistas = () => {
  const context = useContext(MensalistaContext);
  if (context === undefined) {
    throw new Error("useMensalistas deve ser usado dentro de um MensalistaProvider");
  }
  return context;
};
