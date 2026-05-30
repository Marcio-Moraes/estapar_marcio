"use client";

import { useState } from "react";
import { useGarages } from "@/hooks/useGarages";
import { BarraInfoMensalistas } from "@/components/layout/barraInfoMensalistas";
import { BarraUserTopo } from "@/components/layout/barraUserTopo";
import iconGaragem from "@/assets/ui/garagens-icon1.png";
import TituloPrincipal from "@/components/layout/tituloPrincipal";
import { LinhaEstacionamentos } from "@/components/layout/linhaEstacionamentos";
import { Modal } from "@/components/layout/popup/modal";

export default function Garagens() {
  const { filteredGarages, addGarage, loading } = useGarages();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidadeUf, setCidadeUf] = useState("");
  const [regional, setRegional] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCodigo("");
    setNome("");
    setEndereco("");
    setCidadeUf("");
    setRegional("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!codigo || !nome || !endereco || !cidadeUf || !regional) {
      setFormError("Todos os campos obrigatórios devem ser preenchidos.");
      setIsSubmitting(false);
      return;
    }

    if (codigo.length < 3) {
      setFormError("O código deve ter pelo menos 3 dígitos.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addGarage({
        codigo,
        nome,
        endereco,
        cidadeUf,
        regional,
        ativo
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || "Ocorreu um erro ao cadastrar a garagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col">
      <BarraUserTopo actionLabel="Nova Garagem" onAction={handleOpenModal} />

      <div className="flex-1 max-w-7xl w-full mx-auto">
        <TituloPrincipal titulo="Garagens" imageUrl={iconGaragem.src} />
        <p className="text-gray-500 mt-1 text-sm font-medium">
          Visualize as garagens habilitadas para mensalistas digitais
        </p>

        <BarraInfoMensalistas />

        <div className="bg-white border border-gray-150 p-6 mt-8 rounded-2xl shadow-xs w-full overflow-hidden">
          {/* Desktop Table Header */}
          <div className="flex pb-4 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <div className="w-[100px]">Código</div>
            <div className="flex-1">Nome</div>
            <div className="hidden lg:block flex-1">Endereço</div>
            <div className="hidden xl:block flex-1">Cidade/UF</div>
            <div className="hidden xl:block flex-1">Regional</div>
            <div className="w-[80px] text-center">Status</div>
            <div className="font-semibold text-right w-[60px] pr-2">Ações</div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-8 h-8 border-4 border-[#7AD33E] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Buscando garagens...</p>
            </div>
          ) : filteredGarages.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-base font-semibold">Nenhuma garagem encontrada</p>
              <p className="text-sm mt-1">Tente ajustar seus termos de busca ou filtros.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredGarages.map((mensalista) => (
                <LinhaEstacionamentos 
                  key={mensalista.codigo}
                  codigo={mensalista.codigo} 
                  nome={mensalista.nome} 
                  endereco={mensalista.endereco} 
                  cidadeUf={mensalista.cidadeUf} 
                  regional={mensalista.regional}
                  ativo={mensalista.ativo} // Custom added to show status badge in row
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Garage Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Novo Estacionamento">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Código (Ex: 000650) *</label>
            <input
              type="text"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="Digite o código identificador"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Estacionamento *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: GMC PARK FARIAS"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço Completo *</label>
            <input
              type="text"
              required
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: RUA JOAQUIM FLORIANO, 620"
              className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade/UF *</label>
              <input
                type="text"
                required
                value={cidadeUf}
                onChange={(e) => setCidadeUf(e.target.value)}
                placeholder="Ex: SÃO PAULO/SP"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Regional *</label>
              <input
                type="text"
                required
                value={regional}
                onChange={(e) => setRegional(e.target.value)}
                placeholder="Ex: SP 1"
                className="border border-gray-200 focus:border-[#7AD33E] focus:ring-2 focus:ring-[#7AD33E]/15 outline-none w-full rounded-xl px-3 py-2 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 border-t border-gray-100 pt-4">
            <input
              type="checkbox"
              id="ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 text-[#7AD33E] focus:ring-[#7AD33E] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="ativo" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Ativo para mensalistas digitais
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