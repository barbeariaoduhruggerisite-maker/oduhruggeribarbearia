# ODuh Ruggeri Barbearia & Visagismo — Site Oficial

Site da Barbearia ODuh Ruggeri com sistema de agendamento online e verificacao de conflito de horarios.

---

## O que foi implementado

- **Banco de dados Supabase (PostgreSQL)** com tabelas de barbeiros, servicos e agendamentos
- **Verificacao de conflito server-side** via funcao PostgreSQL (`criar_agendamento`) — roda de forma atomica no servidor, impossivel burlar pelo frontend
- **Horarios disponiveis dinamicos** — carregados do banco em tempo real, levando em conta a duracao de cada servico
- **Formulario atualizado** com campos de telefone e selecao de barbeiro
- **Loading states** em todas as chamadas ao banco
- **Exibicao de horarios alternativos** quando ha conflito
- **WhatsApp so e aberto apos confirmacao do banco** — nunca antes

---

## Configurar o banco de dados (Supabase) — passo a passo

### 1. Criar projeto Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project**
3. Escolha um nome (ex: `oduhruggeribarbearia`) e uma senha forte para o banco
4. Selecione a regiao mais proxima (ex: `South America (São Paulo)`)
5. Aguarde o projeto ser criado (~2 minutos)

### 2. Executar o schema SQL

1. No painel do Supabase, va em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Cole o conteudo inteiro no editor
5. Clique em **Run** (ou Ctrl+Enter)
6. Deve aparecer "Success. No rows returned" — isso e correto

O script cria as tabelas, as funcoes RPC, as politicas de seguranca e popula com os dados reais da barbearia.

### 3. Atualizar nome do segundo barbeiro (opcional)

No SQL Editor, execute:
```sql
UPDATE barbeiros SET nome = 'Nome Real Aqui' WHERE nome = 'Wellington';
```

---

## Configurar variaveis de ambiente

### Desenvolvimento local

1. Copie o arquivo de exemplo:
   ```
   cp .env.example .env.local
   ```

2. No painel do Supabase, va em **Project Settings > API**

3. Copie os valores e cole no `.env.local`:
   ```
   VITE_SUPABASE_URL=https://SEU_PROJETO_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Nunca commite o arquivo `.env.local`** — ele ja esta no `.gitignore`

### Vercel (producao)

1. No painel da Vercel, acesse seu projeto
2. Va em **Settings > Environment Variables**
3. Adicione as duas variaveis:
   - `VITE_SUPABASE_URL` → URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` → chave anon publica
4. Marque para os ambientes: **Production**, **Preview** e **Development**
5. Clique em **Save** e faca um novo deploy (ou **Redeploy** no ultimo deploy)

---

## Rodar localmente

```bash
# 1. Instalar dependencias (inclui @supabase/supabase-js)
npm install

# 2. Criar e preencher o .env.local (ver secao acima)
cp .env.example .env.local

# 3. Iniciar o servidor de desenvolvimento
npm run dev

# O site estara disponivel em http://localhost:8080
```

---

## Testar o fluxo de agendamento

### Teste 1: Agendamento com sucesso
1. Preencha nome, telefone, barbeiro, servico, data e horario
2. Clique em "Confirmar agendamento no WhatsApp"
3. Deve abrir o WhatsApp com a mensagem formatada
4. Verifique no Supabase (Table Editor > agendamentos) que o registro foi criado com status "confirmado"

### Teste 2: Conflito de horario
1. Faca um primeiro agendamento (anote barbeiro, data e horario)
2. Em outra aba, tente agendar o mesmo barbeiro, mesma data, mesmo horario
3. O formulario deve mostrar a mensagem de erro e sugerir horarios alternativos
4. O WhatsApp nao deve abrir

### Teste 3: Horarios dinamicos
1. Selecione um barbeiro + servico com duracao longa (ex: Platinado = 3h)
2. Observe que o grid de horarios mostra menos opcoes que servicos rapidos
3. Servicos curtos (ex: Acabamento = 20min) mostram mais slots

---

## Arquitetura da verificacao de conflito

A logica critica roda inteiramente no **PostgreSQL (Supabase)**, nao no browser:

```
Browser → supabase.rpc('criar_agendamento', {...})
                          ↓
                  PostgreSQL (Supabase)
                  SECURITY DEFINER function
                  ├─ Busca duracao do servico
                  ├─ Calcula horario_fim
                  ├─ SELECT COUNT(*) com logica de sobreposicao
                  │    horario_inicio < fim_novo AND horario_fim > inicio_novo
                  ├─ SE conflito → retorna erro + horarios alternativos
                  └─ SE livre → INSERT INTO agendamentos + retorna sucesso
```

A funcao usa `SECURITY DEFINER`, o que significa que roda com privilegios do dono do banco, ignorando RLS. Isso garante que:
- A leitura dos agendamentos e a insercao acontecem na mesma transacao
- Nao ha race condition entre dois clientes tentando o mesmo horario
- Clientes anonimos nao conseguem ler dados de outros clientes diretamente

---

## Arquivos criados/modificados

| Arquivo | Status | Descricao |
|---------|--------|-----------|
| `supabase/schema.sql` | Novo | Schema completo: tabelas, RPC, seed data |
| `src/lib/supabase.ts` | Novo | Cliente Supabase |
| `src/lib/agendamento.ts` | Novo | Camada de API (fetchBarbeiros, fetchHorariosDisponiveis, criarAgendamento) |
| `src/components/Scheduling.tsx` | Modificado | Formulario com banco de dados integrado |
| `package.json` | Modificado | Adicionado @supabase/supabase-js |
| `.env.example` | Novo | Template de variaveis de ambiente |
| `.gitignore` | Modificado | Protecao explicita do .env.local |

---

## Proximos passos para o deploy na Vercel

1. Commite e faca push das alteracoes para o repositorio no GitHub
2. Configure as variaveis de ambiente na Vercel (ver secao acima)
3. A Vercel detecta automaticamente que e um projeto Vite e faz o deploy
4. Verifique o deploy em producao fazendo um agendamento real de teste

---

## Tecnologias

- Vite 5 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL) — banco serverless gratuito
- Vercel — hosting
