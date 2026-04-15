-- =============================================================
-- ODuh Ruggeri Barbearia & Visagismo -- Schema Completo
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- TABELAS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS barbeiros (
  id    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  nome  TEXT    NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS servicos (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            TEXT    NOT NULL UNIQUE,
  duracao_minutos INTEGER NOT NULL,
  preco           TEXT    NOT NULL  -- mantido como TEXT pois ha "a partir de R$..."
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome     TEXT        NOT NULL,
  cliente_telefone TEXT        NOT NULL,
  barbeiro_id      UUID        NOT NULL REFERENCES barbeiros(id),
  servico_id       UUID        NOT NULL REFERENCES servicos(id),
  data_agendamento DATE        NOT NULL,
  horario_inicio   TIME        NOT NULL,
  horario_fim      TIME        NOT NULL,  -- calculado: horario_inicio + duracao do servico
  status           TEXT        NOT NULL DEFAULT 'confirmado'
                               CHECK (status IN ('confirmado', 'cancelado', 'concluido')),
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indice para acelerar a verificacao de conflito
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_data
  ON agendamentos (barbeiro_id, data_agendamento);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

ALTER TABLE barbeiros    ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ler barbeiros ativos e servicos (para popular o formulario)
CREATE POLICY "barbeiros_leitura_publica"
  ON barbeiros FOR SELECT TO anon, authenticated
  USING (ativo = true);

CREATE POLICY "servicos_leitura_publica"
  ON servicos FOR SELECT TO anon, authenticated
  USING (true);

-- agendamentos: acesso apenas pelas funcoes RPC (SECURITY DEFINER).
-- Nao ha politica de SELECT/INSERT direta para anon.

-- ─────────────────────────────────────────────────────────────
-- FUNCAO: horarios_disponiveis
-- Retorna slots livres de 30min para um barbeiro em uma data,
-- levando em conta a duracao do servico solicitado.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION horarios_disponiveis(
  p_barbeiro_id  UUID,
  p_data         DATE,
  p_servico_nome TEXT
)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER  -- roda como dono do DB, ignorando RLS sobre agendamentos
AS $$
DECLARE
  v_duracao     INTEGER;
  v_dia_semana  INTEGER;  -- 0=Dom, 1=Seg, ..., 6=Sab
  v_hora_inicio TIME;
  v_hora_fim    TIME;
  v_slot        TIME;
  v_slot_fim    TIME;
  v_disponivel  BOOLEAN;
  v_slots       TEXT[] := '{}';
BEGIN
  -- Busca duracao do servico pelo nome
  SELECT duracao_minutos INTO v_duracao
  FROM servicos
  WHERE nome = p_servico_nome
  LIMIT 1;

  IF v_duracao IS NULL THEN
    RETURN v_slots;  -- Servico nao encontrado -> retorna vazio
  END IF;

  -- Dia da semana da data solicitada
  v_dia_semana := EXTRACT(DOW FROM p_data)::INTEGER;

  -- Domingo: fechado
  IF v_dia_semana = 0 THEN
    RETURN v_slots;
  END IF;

  -- Horario de funcionamento:
  -- Qui (4) e Sex (5): 09:00-21:00  |  demais dias: 09:00-20:00
  v_hora_inicio := '09:00'::TIME;
  IF v_dia_semana IN (4, 5) THEN
    v_hora_fim := '21:00'::TIME;
  ELSE
    v_hora_fim := '20:00'::TIME;
  END IF;

  -- Itera por slots de 30 em 30 minutos
  v_slot := v_hora_inicio;
  WHILE v_slot + (v_duracao || ' minutes')::INTERVAL <= v_hora_fim LOOP
    v_slot_fim := v_slot + (v_duracao || ' minutes')::INTERVAL;

    -- Verifica conflito: existe agendamento ativo que se sobreponha a este slot?
    -- Condicao de sobreposicao:
    --   inicio_existente < fim_novo  AND  fim_existente > inicio_novo
    SELECT NOT EXISTS (
      SELECT 1 FROM agendamentos
      WHERE barbeiro_id     = p_barbeiro_id
        AND data_agendamento = p_data
        AND status           != 'cancelado'
        AND horario_inicio   < v_slot_fim   -- agendamento existente comeca antes do slot terminar
        AND horario_fim      > v_slot       -- agendamento existente termina depois do slot comecar
    ) INTO v_disponivel;

    IF v_disponivel THEN
      v_slots := array_append(v_slots, TO_CHAR(v_slot, 'HH24:MI'));
    END IF;

    v_slot := v_slot + INTERVAL '30 minutes';
  END LOOP;

  RETURN v_slots;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- FUNCAO: criar_agendamento
-- Verifica conflito de forma atomica no servidor e insere o
-- agendamento se o horario estiver livre.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION criar_agendamento(
  p_cliente_nome      TEXT,
  p_cliente_telefone  TEXT,
  p_barbeiro_id       UUID,
  p_servico_nome      TEXT,
  p_data              DATE,
  p_horario_inicio    TIME
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_servico_id  UUID;
  v_duracao     INTEGER;
  v_horario_fim TIME;
  v_conflict    BOOLEAN;
  v_novo_id     UUID;
  v_alternativos TEXT[];
BEGIN
  -- Busca servico pelo nome
  SELECT id, duracao_minutos
    INTO v_servico_id, v_duracao
  FROM servicos
  WHERE nome = p_servico_nome
  LIMIT 1;

  IF v_servico_id IS NULL THEN
    RETURN json_build_object('sucesso', false, 'erro', 'Servico nao encontrado.');
  END IF;

  -- Calcula horario de fim com base na duracao do servico
  v_horario_fim := p_horario_inicio + (v_duracao || ' minutes')::INTERVAL;

  -- ── VERIFICACAO DE CONFLITO (server-side, atomica na transacao) ──
  -- Detecta se existe agendamento ativo que se sobreponha ao novo slot:
  --   inicio_existente < fim_novo  AND  fim_existente > inicio_novo
  SELECT EXISTS (
    SELECT 1 FROM agendamentos
    WHERE barbeiro_id     = p_barbeiro_id
      AND data_agendamento = p_data
      AND status           != 'cancelado'
      AND horario_inicio   < v_horario_fim
      AND horario_fim      > p_horario_inicio
  ) INTO v_conflict;

  IF v_conflict THEN
    -- Retorna horarios alternativos disponiveis no mesmo dia
    v_alternativos := horarios_disponiveis(p_barbeiro_id, p_data, p_servico_nome);

    RETURN json_build_object(
      'sucesso',               false,
      'erro',                  'Horario indisponivel. Outro cliente acabou de reservar este horario.',
      'horarios_alternativos', v_alternativos
    );
  END IF;

  -- Sem conflito: salva o agendamento
  INSERT INTO agendamentos (
    cliente_nome,    cliente_telefone,
    barbeiro_id,     servico_id,
    data_agendamento, horario_inicio, horario_fim,
    status
  ) VALUES (
    p_cliente_nome, p_cliente_telefone,
    p_barbeiro_id,  v_servico_id,
    p_data, p_horario_inicio, v_horario_fim,
    'confirmado'
  ) RETURNING id INTO v_novo_id;

  RETURN json_build_object(
    'sucesso', true,
    'id',      v_novo_id::TEXT
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- FUNCAO: agendamentos_do_dia (painel admin futuro)
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION agendamentos_do_dia(p_data DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  id               UUID,
  cliente_nome     TEXT,
  cliente_telefone TEXT,
  barbeiro_nome    TEXT,
  servico_nome     TEXT,
  horario_inicio   TIME,
  horario_fim      TIME,
  status           TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    a.id,
    a.cliente_nome,
    a.cliente_telefone,
    b.nome  AS barbeiro_nome,
    s.nome  AS servico_nome,
    a.horario_inicio,
    a.horario_fim,
    a.status
  FROM agendamentos a
  JOIN barbeiros b ON b.id = a.barbeiro_id
  JOIN servicos  s ON s.id = a.servico_id
  WHERE a.data_agendamento = p_data
  ORDER BY a.horario_inicio;
$$;

-- ─────────────────────────────────────────────────────────────
-- PERMISSOES: anon pode chamar as funcoes RPC
-- ─────────────────────────────────────────────────────────────

GRANT EXECUTE ON FUNCTION horarios_disponiveis(UUID, DATE, TEXT)                      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION criar_agendamento(TEXT, TEXT, UUID, TEXT, DATE, TIME)       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION agendamentos_do_dia(DATE)                                   TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- DADOS REAIS DA BARBEARIA -- BARBEIROS
-- ATENCAO: Atualize o nome do segundo barbeiro conforme necessario
-- ─────────────────────────────────────────────────────────────

INSERT INTO barbeiros (nome, ativo) VALUES
  ('Oduh Ruggeri', true),
  ('Wellington',   true)   -- Atualize para o nome real do segundo barbeiro
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- DADOS REAIS DA BARBEARIA -- SERVICOS (com duracao estimada)
-- Nomes identicos ao services.ts para garantir o mapeamento correto
-- ─────────────────────────────────────────────────────────────

INSERT INTO servicos (nome, duracao_minutos, preco) VALUES
  -- Cabelo
  ('Corte Masculino',           45,  'R$80,00'),
  ('Corte com Visagismo',       90,  'R$200,00'),
  ('Consultoria de Visagismo',  120, 'R$700,00'),
  ('Corte + Sobrancelhas',      60,  'R$100,00'),
  ('Corte raspado',             30,  'R$50,00'),
  ('Coloração / Tonalização',   90,  'R$80,00'),
  ('Hidratação',                60,  'R$60,00'),
  ('Botox Capilar',             120, 'a partir de R$150,00'),
  ('Luzes',                     150, 'a partir de R$150,00'),
  ('Platinado',                 180, 'a partir de R$200,00'),
  ('Progressiva',               120, 'a partir de R$150,00'),
  ('Relaxamento',               90,  'R$60,00'),
  ('Corte & Relaxamento',       120, 'R$130,00'),
  ('Camuflagem de Brancos',     60,  'Consultar'),
  -- Barba e Bigode
  ('Barba',                               45,  'R$80,00'),
  ('Barba + Sobrancelhas',                60,  'R$100,00'),
  ('Barba com Máquina',                   30,  'R$50,00'),
  ('Barboterapia',                        60,  'R$85,00'),
  ('Barboterapia + Combo Cera',           75,  'R$130,00'),
  ('Barboterapia + Sobrancelhas',         75,  'R$100,00'),
  ('Barboterapia + Sobr. + Cera',         90,  'R$150,00'),
  ('Barba e Cabelo',                      90,  'R$130,00'),
  ('Corte e Barba + Sobrancelhas',        90,  'R$170,00'),
  ('Cabelo + Cera Ouvido/Nariz',          60,  'R$150,00'),
  ('Acabamento',                          20,  'R$40,00'),
  -- Estética & Bem-estar
  ('Sobrancelhas',                        20,  'R$40,00'),
  ('Cera (Ouvido, Nariz)',                20,  'R$40,00'),
  ('Depilação Combo Ouvido + Nariz',      25,  'R$80,00'),
  ('Depilação Nariz ou Ouvido',           15,  'R$50,00'),
  ('Massagem Terapêutica',                60,  'R$180,00'),
  ('Massagem Relaxante',                  60,  'R$180,00'),
  ('Drenagem Linfática',                  60,  'R$180,00')
ON CONFLICT (nome) DO NOTHING;
