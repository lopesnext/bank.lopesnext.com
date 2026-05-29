# BankLopesNext - Plataforma de Banco Online de Testes

Uma aplicação completa de banco online de testes construída com Node.js, Express, React, TypeScript e MySQL.

## 🏦 Funcionalidades

- **Sistema de Autenticação**: Login e registo com JWT
- **Validações Portuguesas**: NIF, CC (Cartão de Cidadão), IBAN
- **Gestão de Contas**: Ver saldo, detalhes da conta e IBAN
- **Transferências**: Enviar dinheiro entre contas com validação de IBAN
- **Histórico de Transações**: Ver últimas 10 transações
- **Internacionalização**: Suporte para Português (PT) e Inglês (EN)
- **Conta Demo**: Conta pré-configurada para testes

## 📋 Credenciais Demo

```
Email: demo@banklopesnext.pt
Password: Demo123!
```

## 🛠️ Stack Tecnológica

### Backend
- Node.js + Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcrypt para hash de passwords

### Frontend
- React.js 18
- TypeScript
- Tailwind CSS
- Vite
- i18next para internacionalização
- Axios para chamadas API
- React Router para navegação

## 📁 Estrutura do Projeto

```
banklopesnext/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuração da base de dados
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── middleware/      # Middleware de autenticação
│   │   ├── models/          # Modelos da base de dados
│   │   ├── routes/          # Rotas da API
│   │   ├── utils/           # Validadores e utilitários
│   │   └── server.ts        # Ficheiro principal do servidor
│   ├── database/
│   │   └── init.sql         # Inicialização da base de dados
│   ├── .env                 # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── i18n/           # Traduções (PT/EN)
│   │   ├── pages/          # Componentes de páginas
│   │   ├── services/       # Serviços API
│   │   └── utils/          # Funções utilitárias
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (v18 ou superior)
- MySQL (v8 ou superior)
- npm ou yarn

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd banklopesnext
```

### 2. Configuração da Base de Dados

1. Iniciar o servidor MySQL
2. Criar a base de dados e tabelas:

```bash
mysql -u root -p < backend/database/init.sql
```

Isto irá:
- Criar a base de dados `banklopesnext`
- Criar tabelas: `users`, `accounts`, `transactions`
- Inserir 5 utilizadores pré-populados com dados portugueses válidos
- Inserir transações históricas entre utilizadores

### 3. Configuração do Backend

```bash
cd backend
npm install
```

Configurar variáveis de ambiente em `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_password
DB_NAME=banklopesnext

PORT=5000
NODE_ENV=development

JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

Iniciar o servidor backend:

```bash
npm run dev
```

A API estará disponível em `http://localhost:5000`

### 4. Configuração do Frontend

```bash
cd frontend
npm install
```

Iniciar o servidor de desenvolvimento frontend:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Contas de Teste Pré-populadas

A base de dados inclui 5 contas de teste com dados portugueses válidos:

| Nome | Email | NIF | IBAN | Saldo |
|------|-------|-----|------|---------|
| João Silva | joao.silva@email.pt | 123456789 | PT50000100001234567890123 | €2.500,00 |
| Maria Santos | maria.santos@email.pt | 234567890 | PT50000100002345678901234 | €3.750,50 |
| Pedro Costa | pedro.costa@email.pt | 345678901 | PT50000100003456789012345 | €1.800,75 |
| Ana Ferreira | ana.ferreira@email.pt | 456789012 | PT50000100004567890123456 | €4.200,25 |
| Demo User | demo@banklopesnext.pt | 987654321 | PT50000100009876543210987 | €5.000,00 |

**Todas as contas têm a password:** `Demo123!`

## 🔐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de utilizador
- `POST /api/auth/register` - Registo de utilizador

### Conta (Protegido)
- `GET /api/account` - Obter detalhes da conta
- `GET /api/account/balance` - Obter saldo da conta
- `GET /api/account/transactions` - Obter histórico de transações

### Transferências (Protegido)
- `POST /api/transfers/validate` - Validar IBAN do destinatário
- `POST /api/transfers` - Criar nova transferência
- `GET /api/transfers/history` - Obter histórico de transferências

## ✅ Regras de Validação

### Campos de Registo

- **Nome Completo**: Obrigatório
- **Email**: Formato de email válido, único
- **Password**: Mínimo 8 caracteres, maiúscula, minúscula e número
- **NIF**: 9 dígitos com algoritmo de validação português, único
- **CC (Cartão de Cidadão)**: Formato: 8 dígitos + dígito verificador + 2 letras + dígito, único
- **Data de Nascimento**: Data válida
- **Morada**: Obrigatório
- **Código Postal**: Formato XXXX-XXX
- **Telemóvel**: 9 dígitos começando com 9
- **Nacionalidade**: Obrigatório

### Formato IBAN

IBAN Português: `PT50` + 21 dígitos (NIB)

Exemplo: `PT50000100001234567890123`

## 🌍 Internacionalização

A aplicação suporta:
- **Português (PT)** - Idioma padrão
- **Inglês (EN)**

O idioma pode ser alterado usando o seletor no cabeçalho.

## 🎨 Design

- **Cor Primária**: Azul (#1E40AF)
- **Logo**: Ícone minimalista de edifício bancário com texto "BankLopesNext"
- **Framework UI**: Tailwind CSS
- **Responsivo**: Design mobile-first

## 📝 Checklist de Funcionalidades

- [x] Autenticação de utilizador (login/registo)
- [x] Segurança baseada em token JWT
- [x] Validação de NIF português
- [x] Validação de CC português
- [x] Geração e validação de IBAN português
- [x] Dashboard de conta com saldo
- [x] Histórico de transações (últimas 10)
- [x] Transferir dinheiro por IBAN
- [x] Validação de destinatário antes da transferência
- [x] Validação de saldo
- [x] Internacionalização (PT/EN)
- [x] Conta demo visível na página inicial
- [x] Base de dados pré-populada com 5 utilizadores
- [x] Transações históricas entre utilizadores
- [x] Design responsivo

## 🧪 Testar a Aplicação

### Testar a Conta Demo

1. Ir para `http://localhost:3000`
2. Clicar em "Experimentar conta demo" ou usar as credenciais:
   - Email: `demo@banklopesnext.pt`
   - Password: `Demo123!`
3. Explorar o dashboard, ver transações e fazer transferências

### Testar Registo

1. Clicar em "Registar" na página inicial
2. Preencher todos os campos obrigatórios com dados portugueses válidos
3. Após registo bem-sucedido, receberá:
   - Um número de conta único de 10 dígitos
   - Um IBAN português válido
   - Saldo inicial de €1.000,00

### Testar Transferências

1. Fazer login em qualquer conta
2. Ir para "Transferências"
3. Inserir um IBAN válido de outra conta de teste
4. Validar o destinatário
5. Inserir montante e descrição
6. Confirmar a transferência
7. Verificar ambas as contas para ver os saldos atualizados

## 🔧 Desenvolvimento

### Backend Development

```bash
cd backend
npm run dev  # Iniciar com nodemon (auto-reload)
npm run build  # Compilar TypeScript
npm start  # Iniciar servidor de produção
```

### Frontend Development

```bash
cd frontend
npm run dev  # Iniciar servidor dev Vite
npm run build  # Compilar para produção
npm run preview  # Pré-visualizar build de produção
```

## 📦 Build de Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Servir a pasta dist/ com o seu servidor web preferido
```

## 🐛 Resolução de Problemas

### Problemas de Conexão à Base de Dados

- Garantir que o MySQL está a correr
- Verificar credenciais em `backend/.env`
- Verificar se a base de dados existe: `SHOW DATABASES;`

### Porta Já em Uso

- Backend: Alterar `PORT` em `backend/.env`
- Frontend: Alterar porta em `frontend/vite.config.ts`

### Erros CORS

- Garantir que `CORS_ORIGIN` em `backend/.env` corresponde ao URL do frontend
- Verificar que ambos os servidores estão a correr

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto para fins de aprendizagem e testes.

---

**Nota**: Esta é uma aplicação de teste/demo. Não usar em produção sem auditorias de segurança e melhorias adequadas.
