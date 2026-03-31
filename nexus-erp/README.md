# Nexus ERP

Sistema de gestão completo para pequenas empresas — PDV, estoque, financeiro, clientes, compras, devoluções, relatórios e muito mais.

## Funcionalidades

| Módulo | O que faz |
|---|---|
| **Dashboard** | KPIs do dia, gráfico 12 meses, alertas de estoque e contas vencendo |
| **PDV** | Ponto de venda com carrinho, clientes e formas de pagamento |
| **Estoque** | Cadastro, filtros, entrada de mercadoria, alertas de estoque crítico |
| **Vendas** | Histórico completo com visualização e devolução por linha |
| **Compras** | Entradas vinculadas ao estoque + geração automática de conta a pagar |
| **Devoluções** | Registro com reposição automática de estoque |
| **Clientes** | Cadastro, fiado, limite de crédito |
| **Financeiro** | Contas a receber / pagar, baixa de títulos, vencidos em destaque |
| **Relatórios** | Geral, Comercial e Financeiro com cards navegáveis |
| **Mensagens** | Chat interno por thread de equipe |
| **Admin** | Usuários, permissões por perfil, log de ações e backup JSON |

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **shadcn/ui** (componentes Radix UI)
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **localStorage** (persistência local — sem banco externo)

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/nexus-erp.git
cd nexus-erp

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

## Deploy no Vercel

```bash
# Via CLI
npx vercel --prod

# Ou conecte o repositório GitHub diretamente em vercel.com
```

Não há variáveis de ambiente necessárias. O projeto roda 100% no lado do cliente com localStorage.

## Próximos passos (roadmap)

- [ ] Autenticação (NextAuth.js)
- [ ] Banco de dados online (Supabase / PlanetScale)
- [ ] Multi-tenant (múltiplas lojas)
- [ ] Relatórios em PDF
- [ ] App mobile (React Native / Expo)

## Licença

MIT
