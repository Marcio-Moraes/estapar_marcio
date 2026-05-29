"use client";

import React, { useState, use } from "react";
import { useGarages } from "@/hooks/useGarages";
import TituloPrincipal from "@/components/layout/tituloPrincipal";
import { ItemDescricaoDetalhes } from "@/components/layout/garagemDetalhes/itemDescricaoDetalhes";
import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import { Modal } from "@/components/layout/popup/modal";
import { LuBuilding, LuCar, LuCircleDollarSign, LuMapPin, LuTrash2, LuSettings } from "react-icons/lu";
import { MdQrCode2 } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import Link from "next/link";
import { Plan, Discount } from "@/types";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default function GaragemDetail({ params }: Props) {
  const { name } = use(params);
  const { garages, updateGarage, loading } = useGarages();
  
  // Find current garage
  const garage = garages.find((g) => g.codigo === name);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<"planos" | "descontos" | "configuracoes">("planos");
  
  // Modals state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Success / Error alerts
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Forms state: Plan
  const [planDescricao, setPlanDescricao] = useState("");
  const [planValor, setPlanValor] = useState(0);
  const [planVagas, setPlanVagas] = useState(0);
  const [planAtivo, setPlanAtivo] = useState(true);

  // Forms state: Discount
  const [discountCupom, setDiscountCupom] = useState("");
  const [discountDescricao, setDiscountDescricao] = useState("");
  const [discountPercentual, setDiscountPercentual] = useState(0);
  const [discountAtivo, setDiscountAtivo] = useState(true);

  // Forms state: Garage Config
  const [configNome, setConfigNome] = useState("");
  const [configEndereco, setConfigEndereco] = useState("");
  const [configCidadeUf, setConfigCidadeUf] = useState("");
  const [configRegional, setConfigRegional] = useState("");
  const [configAtivo, setConfigAtivo] = useState(true);

  // Initialize config form on load
  React.useEffect(() => {
    if (garage) {
      setConfigNome(garage.nome);
      setConfigEndereco(garage.endereco);
      setConfigCidadeUf(garage.cidadeUf);
      setConfigRegional(garage.regional);
      setConfigAtivo(garage.ativo);
    }
  }, [garage]);

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col justify-center items-center text-gray-400 gap-3">
        <div className="w-10 h-10 border-4 border-[#7AD33E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Carregando detalhes do estacionamento...</p>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen p-8">
        <BarraUserTopo />
        <div className="max-w-md mx-auto mt-16 bg-white border border-gray-150 rounded-2xl p-8 text-center shadow-xs">
          <TituloPrincipal titulo="Não Encontrada" />
          <p className="text-gray-500 mt-4">Garagem com código "{name}" não foi localizada no sistema.</p>
          <Link 
            href="/garagens" 
            className="mt-6 inline-block bg-[#7AD33E] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#6ec236] transition-colors text-sm"
          >
            Voltar para Garagens
          </Link>
        </div>
      </div>
    );
  }

  // Formatting utility
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const handleOpenPlanModal = (plan?: Plan) => {
    setModalError(null);
    if (plan) {
      setEditingPlan(plan);
      setPlanDescricao(plan.descricao);
      setPlanValor(plan.valor);
      setPlanVagas(plan.vagas);
      setPlanAtivo(plan.ativo);
    } else {
      setEditingPlan(null);
      setPlanDescricao("");
      setPlanValor(0);
      setPlanVagas(10);
      setPlanAtivo(true);
    }
    setIsPlanModalOpen(true);
  };

  const handleOpenDiscountModal = () => {
    setModalError(null);
    setDiscountCupom("");
    setDiscountDescricao("");
    setDiscountPercentual(5);
    setDiscountAtivo(true);
    setIsDiscountModalOpen(true);
  };

  const triggerSuccessAlert = (message: string) => {
    setSaveSuccess(message);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Plan Form Submit
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!planDescricao || planValor <= 0 || planVagas <= 0) {
      setModalError("Todos os campos do plano são obrigatórios.");
      return;
    }

    let updatedPlansList: Plan[] = [];

    if (editingPlan) {
      // Edit existing plan
      updatedPlansList = garage.planos.map((p) => {
        if (p.id === editingPlan.id) {
          const ocupadas = p.ocupadas;
          return {
            ...p,
            descricao: planDescricao,
            valor: planValor,
            vagas: planVagas,
            disponiveis: Math.max(0, planVagas - ocupadas),
            ativo: planAtivo
          };
        }
        return p;
      });
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: `p-${Date.now()}`,
        descricao: planDescricao,
        valor: planValor,
        vagas: planVagas,
        ocupadas: 0,
        disponiveis: planVagas,
        ativo: planAtivo,
      };
      updatedPlansList = [...garage.planos, newPlan];
    }

    try {
      await updateGarage(garage.codigo, { planos: updatedPlansList });
      setIsPlanModalOpen(false);
      triggerSuccessAlert(editingPlan ? "Plano atualizado com sucesso!" : "Novo plano adicionado!");
    } catch (err: any) {
      setModalError(err?.message || "Erro ao salvar o plano.");
    }
  };

  // Delete Plan
  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Deseja realmente excluir este plano?")) return;
    
    const updatedPlansList = garage.planos.filter((p) => p.id !== planId);
    try {
      await updateGarage(garage.codigo, { planos: updatedPlansList });
      triggerSuccessAlert("Plano excluído com sucesso.");
    } catch (err: any) {
      setErrorMsg("Erro ao excluir plano.");
    }
  };

  // Discount Form Submit
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!discountCupom || !discountDescricao || discountPercentual <= 0) {
      setModalError("Todos os campos do cupom são obrigatórios.");
      return;
    }

    const newDiscount: Discount = {
      id: `d-${Date.now()}`,
      cupom: discountCupom.toUpperCase(),
      descricao: discountDescricao,
      descontoPercentual: discountPercentual,
      ativo: discountAtivo,
    };

    const updatedDiscounts = [...garage.descontos, newDiscount];

    try {
      await updateGarage(garage.codigo, { descontos: updatedDiscounts });
      setIsDiscountModalOpen(false);
      triggerSuccessAlert("Desconto adicionado com sucesso!");
    } catch (err: any) {
      setModalError(err?.message || "Erro ao criar desconto.");
    }
  };

  // Delete Discount
  const handleDeleteDiscount = async (discountId: string) => {
    if (!window.confirm("Deseja realmente remover este cupom?")) return;

    const updatedDiscounts = garage.descontos.filter((d) => d.id !== discountId);
    try {
      await updateGarage(garage.codigo, { descontos: updatedDiscounts });
      triggerSuccessAlert("Cupom de desconto removido.");
    } catch (err: any) {
      setErrorMsg("Erro ao remover cupom.");
    }
  };

  // Garage Profile Config Save
  const handleSaveGarageConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaveSuccess(null);

    if (!configNome || !configEndereco || !configCidadeUf || !configRegional) {
      setErrorMsg("Todos os campos de cadastro são obrigatórios.");
      return;
    }

    try {
      await updateGarage(garage.codigo, {
        nome: configNome,
        endereco: configEndereco,
        cidadeUf: configCidadeUf,
        regional: configRegional,
        ativo: configAtivo,
      });
      triggerSuccessAlert("Configurações do estacionamento salvas com sucesso!");
    } catch (err: any) {
      setErrorMsg(err?.message || "Erro ao salvar configurações.");
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col relative">
      <BarraUserTopo />

      {/* Floating Success Notifications */}
      {saveSuccess && (
        <div className="fixed top-8 right-8 z-50 bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all animate-bounce">
          {saveSuccess}
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-8 right-8 z-50 bg-red-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all animate-shake">
          {errorMsg}
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto flex-1">
        {/* Detail Header Title block */}
        <div className="relative bg-white border border-gray-150 p-6 rounded-2xl shadow-xs">
          <TituloPrincipal titulo={`Garagem - ${garage.nome}`} />
          
          <Link 
            href="/garagens"
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all font-bold flex items-center justify-center cursor-pointer"
            title="Fechar detalhes"
          >
            Fechar ×
          </Link>
          
          <div className="mt-3.5 flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 uppercase">
              <span className="text-[#7AD33E] font-bold">Cód:</span> {garage.codigo}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 uppercase">
              <LuMapPin className="text-[#7AD33E]" />
              {garage.endereco}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 uppercase">
              <LuBuilding className="text-[#7AD33E]" />
              Filial: {garage.cidadeUf} ({garage.regional})
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                garage.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
              }`}>
                {garage.ativo ? "Habilitado" : "Desativado"}
              </span>
            </div>
          </div>
        </div>

        {/* Occupancy Indicator Blocks */}
        <div className="flex flex-col md:flex-row gap-6 mt-6 items-stretch">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ItemDescricaoDetalhes title="Total de Vagas" value={garage.vagasTotais} />
            <ItemDescricaoDetalhes title="Ocupadas" value={garage.vagasOcupadas} iconColor="text-orange-400" />
            <ItemDescricaoDetalhes title="Disponíveis" value={garage.vagasDisponiveis} iconColor="text-green-500" />
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-center shadow-xs">
            <div className="flex flex-col items-center">
              <MdQrCode2 size={100} className="text-gray-800" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Check-in Digital</span>
            </div>
          </div>
        </div>

        {/* Tabs and Tab Content Section */}
        <div className="flex flex-col lg:flex-row gap-6 mt-8 items-start">
          {/* Tab Selection Navigation */}
          <div className="w-full lg:w-64 bg-white border border-gray-150 rounded-2xl p-3 shadow-xs">
            <ul className="flex flex-row lg:flex-col gap-1.5 w-full">
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab("planos")}
                  className={`w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "planos"
                      ? "bg-[#7AD33E]/10 text-[#5fa530] font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <LuCircleDollarSign size={18} className="mr-2" />
                  Planos
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab("descontos")}
                  className={`w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "descontos"
                      ? "bg-[#7AD33E]/10 text-[#5fa530] font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <RiDiscountPercentLine size={18} className="mr-2" />
                  Descontos
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab("configuracoes")}
                  className={`w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "configuracoes"
                      ? "bg-[#7AD33E]/10 text-[#5fa530] font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <LuSettings size={18} className="mr-2" />
                  Configurações
                </button>
              </li>
            </ul>
          </div>

          {/* Active Tab Panel Body */}
          <div className="flex-1 w-full bg-white border border-gray-150 rounded-2xl p-6 shadow-xs min-h-[300px]">
            {/* PLANOS TAB */}
            {activeTab === "planos" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Planos de Estacionamento</h3>
                  <button
                    onClick={() => handleOpenPlanModal()}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Adicionar Plano
                  </button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xxs">
                  <div className="bg-gray-50 flex border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-4">
                    <div className="flex-1">Descrição</div>
                    <div className="w-[120px] text-center">Valor</div>
                    <div className="w-[80px] text-center hidden sm:block">Vagas</div>
                    <div className="w-[80px] text-center hidden md:block">Ocupadas</div>
                    <div className="w-[100px] text-center hidden sm:block">Status</div>
                    <div className="w-[100px] text-right">Ações</div>
                  </div>

                  {garage.planos.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-sm">
                      Nenhum plano cadastrado.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {garage.planos.map((plano) => (
                        <div key={plano.id} className="flex py-3.5 px-4 items-center text-sm text-gray-600 hover:bg-gray-50/50 transition-colors">
                          <div className="flex-1 font-semibold text-gray-800 flex items-center gap-2">
                            <LuCar size={16} className="text-[#7AD33E]" />
                            {plano.descricao}
                          </div>
                          <div className="w-[120px] text-center font-bold text-gray-900">{formatBRL(plano.valor)}</div>
                          <div className="w-[80px] text-center hidden sm:block">{plano.vagas}</div>
                          <div className="w-[80px] text-center hidden md:block">{plano.ocupadas}</div>
                          <div className="w-[100px] text-center hidden sm:block">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                              plano.ativo 
                                ? "bg-green-50 text-green-700 border border-green-200" 
                                : "bg-gray-50 text-gray-500 border border-gray-200"
                            }`}>
                              {plano.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="w-[100px] flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleOpenPlanModal(plano)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                              title="Editar plano"
                            >
                              <FaRegEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeletePlan(plano.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir plano"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DESCONTOS TAB */}
            {activeTab === "descontos" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Cupons de Desconto</h3>
                  <button
                    onClick={handleOpenDiscountModal}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Novo Cupom
                  </button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xxs">
                  <div className="bg-gray-50 flex border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-4">
                    <div className="w-[140px]">Cupom</div>
                    <div className="flex-1">Descrição</div>
                    <div className="w-[100px] text-center">Desconto</div>
                    <div className="w-[90px] text-center hidden sm:block">Status</div>
                    <div className="w-[60px] text-right">Ações</div>
                  </div>

                  {garage.descontos.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-sm">
                      Nenhum cupom de desconto configurado.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {garage.descontos.map((desc) => (
                        <div key={desc.id} className="flex py-3.5 px-4 items-center text-sm text-gray-600 hover:bg-gray-50/50 transition-colors">
                          <div className="w-[140px] font-bold text-gray-900 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded text-center text-xs tracking-wider">
                            {desc.cupom}
                          </div>
                          <div className="flex-1 font-semibold text-gray-700 pl-4">{desc.descricao}</div>
                          <div className="w-[100px] text-center font-bold text-emerald-600">{desc.descontoPercentual}%</div>
                          <div className="w-[90px] text-center hidden sm:block">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                              desc.ativo 
                                ? "bg-green-50 text-green-700 border border-green-200" 
                                : "bg-gray-50 text-gray-500 border border-gray-200"
                            }`}>
                              {desc.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="w-[60px] flex justify-end">
                            <button 
                              onClick={() => handleDeleteDiscount(desc.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir cupom"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONFIGURAÇÕES TAB */}
            {activeTab === "configuracoes" && (
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-6">Configurações Gerais</h3>

                <form onSubmit={handleSaveGarageConfig} className="flex flex-col gap-5 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do Estabelecimento *</label>
                    <input
                      type="text"
                      required
                      value={configNome}
                      onChange={(e) => setConfigNome(e.target.value)}
                      className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-4 py-2.5 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Endereço Completo *</label>
                    <input
                      type="text"
                      required
                      value={configEndereco}
                      onChange={(e) => setConfigEndereco(e.target.value)}
                      className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-4 py-2.5 text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cidade/UF *</label>
                      <input
                        type="text"
                        required
                        value={configCidadeUf}
                        onChange={(e) => setConfigCidadeUf(e.target.value)}
                        className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-4 py-2.5 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Regional *</label>
                      <input
                        type="text"
                        required
                        value={configRegional}
                        onChange={(e) => setConfigRegional(e.target.value)}
                        className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-4 py-2.5 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      id="configAtivo"
                      checked={configAtivo}
                      onChange={(e) => setConfigAtivo(e.target.checked)}
                      className="h-4.5 w-4.5 text-[#7AD33E] focus:ring-[#7AD33E] border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="configAtivo" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Ativo para mensalistas digitais
                    </label>
                  </div>

                  <div className="border-t border-gray-100 pt-5 mt-4">
                    <button
                      type="submit"
                      className="cursor-pointer bg-[#7AD33E] hover:bg-[#6ec236] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-colors"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PLAN MODAL */}
      <Modal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
        title={editingPlan ? "Editar Plano de Mensalidade" : "Novo Plano de Mensalidade"}
      >
        <form onSubmit={handleSavePlan} className="flex flex-col gap-4">
          {modalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
              {modalError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição do Plano *</label>
            <input
              type="text"
              required
              value={planDescricao}
              onChange={(e) => setPlanDescricao(e.target.value)}
              placeholder="Ex: Plano Mensal Integral"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Mensal (R$) *</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={planValor || ""}
                onChange={(e) => setPlanValor(parseFloat(e.target.value) || 0)}
                placeholder="400.00"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Limite de Vagas *</label>
              <input
                type="number"
                required
                min="1"
                value={planVagas || ""}
                onChange={(e) => setPlanVagas(parseInt(e.target.value) || 0)}
                placeholder="30"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 border-t border-gray-100 pt-4">
            <input
              type="checkbox"
              id="planAtivo"
              checked={planAtivo}
              onChange={(e) => setPlanAtivo(e.target.checked)}
              className="h-4 w-4 text-[#7AD33E] focus:ring-[#7AD33E] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="planAtivo" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Plano Habilitado para Contratação
            </label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#7AD33E] hover:bg-[#6ec236] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
            >
              {editingPlan ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DISCOUNT MODAL */}
      <Modal 
        isOpen={isDiscountModalOpen} 
        onClose={() => setIsDiscountModalOpen(false)} 
        title="Criar Cupom de Desconto"
      >
        <form onSubmit={handleSaveDiscount} className="flex flex-col gap-4">
          {modalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
              {modalError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Código do Cupom *</label>
            <input
              type="text"
              required
              value={discountCupom}
              onChange={(e) => setDiscountCupom(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 15))}
              placeholder="Ex: PARCEIRO20"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição/Regra *</label>
            <input
              type="text"
              required
              value={discountDescricao}
              onChange={(e) => setDiscountDescricao(e.target.value)}
              placeholder="Ex: Desconto exclusivo de 20% para credenciados"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Percentual de Desconto (%) *</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={discountPercentual || ""}
              onChange={(e) => setDiscountPercentual(parseInt(e.target.value) || 0)}
              placeholder="20"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-3 mt-2 border-t border-gray-100 pt-4">
            <input
              type="checkbox"
              id="discountAtivo"
              checked={discountAtivo}
              onChange={(e) => setDiscountAtivo(e.target.checked)}
              className="h-4 w-4 text-[#7AD33E] focus:ring-[#7AD33E] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="discountAtivo" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Ativar Cupom Imediatamente
            </label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsDiscountModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#7AD33E] hover:bg-[#6ec236] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
            >
              Criar Cupom
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}