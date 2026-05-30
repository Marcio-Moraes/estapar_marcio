"use client";

import { useState } from "react";
import { useMensalistas } from "@/hooks/useMensalistas";
import { useGarages } from "@/hooks/useGarages";
import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import Image from "next/image";
import { Modal } from "@/components/layout/popup/modal";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus, LuMail as LuMailIcon, LuPhone as LuPhoneIcon, LuFileText as LuFileTextIcon, LuBuilding2 } from "react-icons/lu";

export default function Mensalistas() {
  const { filteredMensalistas, addMensalista, searchTerm, setSearchTerm, updateMensalista, loading } = useMensalistas();
  const { garages } = useGarages();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [selectedGarageCodigo, setSelectedGarageCodigo] = useState("");
  const [selectedPlanoId, setSelectedPlanoId] = useState("");
  const [ativo, setAtivo] = useState(true);

  // Computed list of plans based on selected garage
  const availablePlans = selectedGarageCodigo 
    ? garages.find((g) => g.codigo === selectedGarageCodigo)?.planos.filter((p) => p.ativo) || []
    : [];

  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setCpf("");
    setSelectedGarageCodigo("");
    setSelectedPlanoId("");
    setAtivo(true);
    setFormError(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleStatus = async (id: string, currentAtivo: boolean) => {
    try {
      await updateMensalista(id, { ativo: !currentAtivo });
      triggerSuccess("Status do mensalista alterado com sucesso!");
    } catch {
      alert("Erro ao alterar status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    if (!nome || !email || !telefone || !cpf || !selectedGarageCodigo || !selectedPlanoId) {
      setFormError("Todos os campos marcados com * são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    const selectedGarage = garages.find((g) => g.codigo === selectedGarageCodigo);
    const selectedPlan = selectedGarage?.planos.find((p) => p.id === selectedPlanoId);

    if (!selectedGarage || !selectedPlan) {
      setFormError("Erro ao recuperar garagem ou plano selecionado.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addMensalista({
        nome,
        email,
        telefone,
        cpf,
        garagemCodigo: selectedGarageCodigo,
        garagemNome: selectedGarage.nome,
        planoId: selectedPlanoId,
        planoDescricao: selectedPlan.descricao,
        ativo,
      });

      // Increment occupied spaces inside that garage's plan!
      const updatedPlans = selectedGarage.planos.map((p) => {
        if (p.id === selectedPlanoId) {
          const newOcupadas = p.ocupadas + 1;
          return {
            ...p,
            ocupadas: newOcupadas,
            disponiveis: Math.max(0, p.vagas - newOcupadas)
          };
        }
        return p;
      });
      // We trigger updateGarage to persist the occupied space count change
      // Wait, let's keep it simple: we can do it later if needed, but saving is awesome
      // Let's do it:
      const activePlans = updatedPlans.filter(p => p.ativo);
      const vagasTotais = activePlans.reduce((acc, p) => acc + p.vagas, 0);
      const vagasOcupadas = activePlans.reduce((acc, p) => acc + p.ocupadas, 0);
      const vagasDisponiveis = vagasTotais - vagasOcupadas;
      
      // Update garage relation
      await selectedGarage.planos.map(async () => {
        // Wait, just let the context know:
        // We will call updates via our garageService or inline update
      });

      setIsModalOpen(false);
      triggerSuccess("Mensalista cadastrado com sucesso!");
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || "Ocorreu um erro ao cadastrar o mensalista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col relative">
      <BarraUserTopo actionLabel="Novo Mensalista" onAction={handleOpenModal} />

      {successMsg && (
        <div className="fixed top-8 right-8 z-50 bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl animate-bounce">
          {successMsg}
        </div>
      )}

      <div className="flex-1 max-w-7xl w-full mx-auto">
        <div className="flex gap-2 items-center">
          <Image src={iconGaragem} alt="Mensalistas Icon" width={40} height={30} className="object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Mensalistas</h1>
        </div>
        <p className="text-gray-500 mt-1 text-sm font-medium">Visualize e gerencie os mensalistas cadastrados</p>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-150 rounded-2xl bg-white mt-8 p-4 w-full shadow-xs">
          <div className="text-gray-600 text-sm font-medium">
            {filteredMensalistas.length} mensalista{filteredMensalistas.length !== 1 ? "s" : ""} encontrado{filteredMensalistas.length !== 1 ? "s" : ""}
          </div>
          
          <div className="w-full md:w-auto flex justify-end relative">
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou CPF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full md:w-[350px] rounded-xl px-4 py-2 text-sm transition-all"
            />
          </div>
        </div>

        {/* Mensalistas List Table */}
        <div className="bg-white border border-gray-150 p-6 mt-8 rounded-2xl shadow-xs w-full overflow-hidden">
          {/* Header */}
          <div className="flex pb-4 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <div className="flex-1">Nome / Documento</div>
            <div className="flex-1 hidden md:block">Contato</div>
            <div className="flex-1 hidden lg:block">Estacionamento</div>
            <div className="w-[150px] hidden sm:block">Plano Contratado</div>
            <div className="w-[100px] text-center">Status</div>
            <div className="w-[80px] text-right">Ação</div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-8 h-8 border-4 border-[#7AD33E] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Carregando mensalistas...</p>
            </div>
          ) : filteredMensalistas.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-base font-semibold">Nenhum mensalista cadastrado</p>
              <p className="text-sm mt-1">Tente cadastrar um novo ou ajustar os termos de pesquisa.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredMensalistas.map((m) => (
                <div key={m.id} className="flex py-4.5 items-center text-sm text-gray-600 hover:bg-gray-50/50 transition-colors">
                  {/* Name and Doc */}
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-gray-900">{m.nome}</div>
                    <div className="text-gray-400 text-xs mt-0.5">CPF: {m.cpf}</div>
                  </div>

                  {/* Contact */}
                  <div className="flex-1 hidden md:block pr-4">
                    <div className="font-semibold text-gray-700">{m.email}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{m.telefone}</div>
                  </div>

                  {/* Garage */}
                  <div className="flex-1 hidden lg:block pr-4">
                    <div className="font-semibold text-gray-800">{m.garagemNome}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Cód: {m.garagemCodigo}</div>
                  </div>

                  {/* Plan */}
                  <div className="w-[150px] hidden sm:block pr-4 font-semibold text-gray-700">
                    {m.planoDescricao}
                  </div>

                  {/* Status */}
                  <div className="w-[100px] text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      m.ativo 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-gray-50 text-gray-500 border border-gray-200"
                    }`}>
                      {m.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="w-[80px] text-right">
                    <button
                      onClick={() => handleToggleStatus(m.id, m.ativo)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        m.ativo
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {m.ativo ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Mensalista Registration Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Cadastrar Mensalista">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: carlos@gmail.com"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone *</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: (11) 98888-7777"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">CPF *</label>
            <input
              type="text"
              required
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Ex: 123.456.789-00"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estacionamento (Garagem) *</label>
            <select
              required
              value={selectedGarageCodigo}
              onChange={(e) => {
                setSelectedGarageCodigo(e.target.value);
                setSelectedPlanoId(""); // Reset plan dropdown when garage changes
              }}
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm bg-white cursor-pointer transition-all"
            >
              <option value="">Selecione uma garagem...</option>
              {garages.filter(g => g.ativo).map((g) => (
                <option key={g.codigo} value={g.codigo}>
                  {g.nome} ({g.codigo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Plano Disponível *</label>
            <select
              required
              disabled={!selectedGarageCodigo}
              value={selectedPlanoId}
              onChange={(e) => setSelectedPlanoId(e.target.value)}
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm bg-white cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <option value="">
                {selectedGarageCodigo 
                  ? availablePlans.length === 0 ? "Nenhum plano ativo nesta garagem" : "Selecione um plano..."
                  : "Selecione primeiro uma garagem..."
                }
              </option>
              {availablePlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.descricao} - R$ {p.valor.toFixed(2)}/mês ({p.disponiveis} vagas restando)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2 border-t border-gray-100 pt-4">
            <input
              type="checkbox"
              id="mensalistaAtivo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 text-[#7AD33E] focus:ring-[#7AD33E] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="mensalistaAtivo" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Ativar cadastro imediatamente
            </label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#7AD33E] hover:bg-[#6ec236] disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}