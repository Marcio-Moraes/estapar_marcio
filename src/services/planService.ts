import { Plan } from "@/types";
import { garageService } from "./garageService";

export const planService = {
  async getPlans(garageCodigo: string): Promise<Plan[]> {
    const garage = await garageService.getGarageByCode(garageCodigo);
    if (!garage) throw new Error("Estacionamento não encontrado.");
    return garage.planos;
  },

  async addPlan(garageCodigo: string, planData: Omit<Plan, "id" | "ocupadas" | "disponiveis">): Promise<Plan> {
    const garage = await garageService.getGarageByCode(garageCodigo);
    if (!garage) throw new Error("Estacionamento não encontrado.");

    const newPlan: Plan = {
      ...planData,
      id: `p-${Date.now()}`,
      ocupadas: 0,
      disponiveis: planData.vagas,
    };

    const updatedPlans = [...garage.planos, newPlan];
    await garageService.updateGarage(garageCodigo, { planos: updatedPlans });

    return newPlan;
  },

  async updatePlan(garageCodigo: string, planId: string, data: Partial<Plan>): Promise<Plan> {
    const garage = await garageService.getGarageByCode(garageCodigo);
    if (!garage) throw new Error("Estacionamento não encontrado.");

    const planIndex = garage.planos.findIndex(p => p.id === planId);
    if (planIndex === -1) throw new Error("Plano não encontrado.");

    const existingPlan = garage.planos[planIndex];
    const updatedPlan: Plan = {
      ...existingPlan,
      ...data,
    };
    
    // Recalculate available spaces if capacity was updated
    if (data.vagas !== undefined) {
      updatedPlan.disponiveis = Math.max(0, data.vagas - updatedPlan.ocupadas);
    }

    const updatedPlans = [...garage.planos];
    updatedPlans[planIndex] = updatedPlan;

    await garageService.updateGarage(garageCodigo, { planos: updatedPlans });

    return updatedPlan;
  },

  async deletePlan(garageCodigo: string, planId: string): Promise<void> {
    const garage = await garageService.getGarageByCode(garageCodigo);
    if (!garage) throw new Error("Estacionamento não encontrado.");

    const updatedPlans = garage.planos.filter(p => p.id !== planId);
    await garageService.updateGarage(garageCodigo, { planos: updatedPlans });
  }
};
