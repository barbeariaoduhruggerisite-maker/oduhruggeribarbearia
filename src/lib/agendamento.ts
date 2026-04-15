/**
 * Camada de acesso ao banco de dados para o sistema de agendamento.
 * Toda a logica critica (verificacao de conflito, insercao atomica)
 * roda em funcoes PostgreSQL SECURITY DEFINER no Supabase — server-side.
 */

import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface Barbeiro {
  id: string;
  nome: string;
}

export interface HorariosResult {
  slots: string[];
  error?: string;
}

export interface AgendarParams {
  clienteNome: string;
  clienteTelefone: string;
  barbeiroId: string;
  barbeiroNome: string;
  servicoNome: string;
  servicoPreco: string;
  data: string;       // "YYYY-MM-DD"
  horario: string;    // "HH:MM"
}

export interface AgendarResult {
  sucesso: boolean;
  id?: string;
  erro?: string;
  horariosAlternativos?: string[];
}

// ─────────────────────────────────────────────────────────────
// API: barbeiros
// ─────────────────────────────────────────────────────────────

/** Busca os barbeiros ativos para popular o select do formulario. */
export async function fetchBarbeiros(): Promise<Barbeiro[]> {
  const { data, error } = await supabase
    .from("barbeiros")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    console.error("[agendamento] Erro ao buscar barbeiros:", error.message);
    return [];
  }

  return (data as Barbeiro[]) ?? [];
}

// ─────────────────────────────────────────────────────────────
// API: horarios disponiveis  →  GET /api/horarios-disponiveis
// Chama a funcao RPC do Supabase que roda em Postgres (server-side).
// ─────────────────────────────────────────────────────────────

/**
 * Retorna os slots de horario disponiveis para um barbeiro
 * em uma data, considerando a duracao do servico escolhido.
 *
 * @param barbeiroId - UUID do barbeiro
 * @param data       - Data no formato "YYYY-MM-DD"
 * @param servicoNome - Nome exato do servico (deve existir na tabela servicos)
 */
export async function fetchHorariosDisponiveis(
  barbeiroId: string,
  data: string,
  servicoNome: string
): Promise<HorariosResult> {
  const { data: slots, error } = await supabase.rpc("horarios_disponiveis", {
    p_barbeiro_id: barbeiroId,
    p_data: data,
    p_servico_nome: servicoNome,
  });

  if (error) {
    console.error("[agendamento] Erro ao buscar horarios:", error.message);
    return {
      slots: [],
      error: "Nao foi possivel carregar os horarios. Tente novamente.",
    };
  }

  return { slots: (slots as string[]) ?? [] };
}

// ─────────────────────────────────────────────────────────────
// API: criar agendamento  →  POST /api/agendar
// A verificacao de conflito acontece DENTRO da funcao Postgres,
// garantindo atomicidade mesmo sob concorrencia.
// ─────────────────────────────────────────────────────────────

/**
 * Cria um agendamento no banco de dados.
 * A logica de conflito roda em Postgres (SECURITY DEFINER), server-side.
 * Retorna sucesso com o ID gerado, ou erro com horarios alternativos.
 */
export async function criarAgendamento(params: AgendarParams): Promise<AgendarResult> {
  const { data: result, error } = await supabase.rpc("criar_agendamento", {
    p_cliente_nome: params.clienteNome,
    p_cliente_telefone: params.clienteTelefone,
    p_barbeiro_id: params.barbeiroId,
    p_servico_nome: params.servicoNome,
    p_data: params.data,
    p_horario_inicio: params.horario + ":00", // "HH:MM" → "HH:MM:00"
  });

  if (error) {
    console.error("[agendamento] Erro ao criar agendamento:", error.message);
    return {
      sucesso: false,
      erro: "Erro ao confirmar o agendamento. Por favor, tente novamente.",
    };
  }

  const res = result as {
    sucesso: boolean;
    id?: string;
    erro?: string;
    horarios_alternativos?: string[];
  };

  return {
    sucesso: res.sucesso,
    id: res.id,
    erro: res.erro,
    horariosAlternativos: res.horarios_alternativos,
  };
}

// ─────────────────────────────────────────────────────────────
// Utilitario: monta a mensagem padrao para o WhatsApp
// Identica ao formato original do site.
// ─────────────────────────────────────────────────────────────

export function buildWhatsAppMessage(params: AgendarParams): string {
  const dateFormatted = new Date(`${params.data}T12:00:00`).toLocaleDateString("pt-BR");

  return [
    `Olá, meu nome é ${params.clienteNome.trim()}.`,
    "",
    `Gostaria de agendar o serviço: ${params.servicoNome}.`,
    `Valor: ${params.servicoPreco}.`,
    `Barbeiro: ${params.barbeiroNome}.`,
    `Data desejada: ${dateFormatted}.`,
    `Horário escolhido: ${params.horario}.`,
  ].join("\n");
}
