import { useContext } from "react";
import { GarageContext } from "@/context/GarageContext";

export const useGarages = () => {
  const context = useContext(GarageContext);
  if (context === undefined) {
    throw new Error("useGarages deve ser usado dentro de um GarageProvider");
  }
  return context;
};
