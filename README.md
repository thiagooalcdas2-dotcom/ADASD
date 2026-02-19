# Plataforma Web de Restaurante (Next.js + Prisma)

Projeto completo com três áreas: cliente, staff e admin/TAZ.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- API interna com Route Handlers REST
- PostgreSQL + Prisma ORM
- JWT + refresh token
- Zod para validação
- Recharts para gráficos do dashboard financeiro

## Módulos
- `auth`
- `clientes`
- `pedidos`
- `reservas`
- `financeiro`
- `relatórios`
- `usuários/roles`

## Setup local
1. Copie variáveis:
   ```bash
   cp .env.example .env
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Rode migração:
   ```bash
   npx prisma migrate dev
   ```
4. Popule seed:
   ```bash
   npx prisma db seed
   ```
5. Inicie app:
   ```bash
   npm run dev
   ```

## Usuários seed
Senha para todos: `123456`
- ADMIN_TAZ: `taz@resto.com`
- ADMIN gerente: `admin@resto.com`
- STAFF: `staff1@resto.com`, `staff2@resto.com`
- CLIENTE: `cliente1@resto.com`, `cliente2@resto.com`

## Rotas principais
### Público
- `/`
- `/menu`
- `/order/new`
- `/order/[id]`
- `/reservations`
- `/support`
- `/support/[ticketId]`

### Auth
- `/login`
- `/register`

### Staff
- `/staff/orders`
- `/staff/reservations`
- `/staff/tickets`

### Admin
- `/admin/dashboard`
- `/admin/menu`
- `/admin/users`
- `/admin/finance`
- `/admin/audit`

## Endpoints principais
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/menu`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/admin/finance/summary?from=&to=`
- `GET/POST /api/admin/expenses`
- `GET /api/admin/reports/export?from=&to=&format=csv`

## Permissões e regra do TAZ
- `ADMIN_TAZ` possui todos os privilégios de ADMIN e bypass de restrições por role.

## Regras financeiras
- Receita = pedidos pagos e entregues + ajustes manuais (`RevenueAdjustment`)
- Despesa = lançamentos em `Expense`
- Lucro bruto = receita - despesas
- Ticket médio = receita / pedidos entregues
- Margem = lucro / receita

## Entregas implementadas
- Schema Prisma completo + migration inicial + seed com usuários, categorias, itens, pedidos e despesas.
- Middleware de proteção por role em `/staff/*` e `/admin/*`.
- Auditoria para ações críticas (status do pedido, despesas, usuários, menu).
- Exportação CSV de relatórios financeiros.
- Dashboard admin com 3 gráficos: receita por dia, despesas por categoria e lucro por período.
