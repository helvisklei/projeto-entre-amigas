# 🚀 Guia de Configuração - Backend Entre Amigas

## 📋 Pré-requisitos

- Node.js 14+
- npm ou yarn
- PostgreSQL (local ou remoto)

## 🔐 Variáveis de Ambiente (IMPORTANTE!)

### 1. Criar arquivo `.env`

```bash
# Na pasta site-corrida/backend/
cp .env.example .env
```

### 2. Preencher as credenciais

Edite `site-corrida/backend/.env`:

```env
# 🔴 BANCO DE DADOS - Credenciais do PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database

# 🔴 SEGURANÇA - Chave para assinar JWT
JWT_SECRET=uma-chave-muito-segura-e-unica-aqui

# Credenciais do admin padrão (seed)
DEFAULT_ADMIN_USER=admin
DEFAULT_ADMIN_PASS=SuaSenhaForte@@

PORT=5000
```

### ⚠️ NUNCA commit `.env` ao Git!

O arquivo `.gitignore` já protege isso, mas **SEMPRE verifique antes de fazer push**.

## 🔍 Verificar Admins no Banco

Para ver quais admins estão cadastrados:

```bash
node check-admins.js
```

Exemplo de saída:
```
✅ Encontrados 2 admin(s):

[1] admin
    Email: admin@helvisklei.com
    Ativo: ✅
    Criado: 02/12/2025 10:30:45

[2] joao_silva
    Email: joao@empresa.com
    Ativo: ✅
    Criado: 02/12/2025 15:20:10
```

## 🚀 Iniciar o Servidor

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm start

# Ou com nodemon (auto-reload)
npm install -g nodemon
nodemon server.js
```

Acesso: http://localhost:5000

## 📊 Fluxo de Autenticação

```
POST /login { usuario, senha }
    ↓
┌─────────────────────────────────────────┐
│ 1. Valida credencial padrão?            │
│    (admin / HVK1080hvk@@)               │
│    SIM → ✅ JWT Token retornado        │
│    NÃO ↓                                │
├─────────────────────────────────────────┤
│ 2. Busca na tabela admins               │
│    Usuario encontrado?                  │
│    NÃO → ❌ Erro 401                   │
│    SIM ↓                                │
├─────────────────────────────────────────┤
│ 3. Senha coincide?                      │
│    SIM → ✅ JWT Token retornado        │
│    NÃO → ❌ Erro 401                   │
└─────────────────────────────────────────┘
```

## 🛡️ Endpoints Principais

### 1. Login
```bash
POST /login
Content-Type: application/json

{
  "usuario": "admin",
  "senha": "HVK1080hvk@@"
}

Response:
{
  "token": "eyJhbGc...",
  "usuario": "admin",
  "id": 1,
  "email": "admin@helvisklei.com"
}
```

### 2. Inscrição
```bash
POST /inscricao
{
  "nome": "Maria Silva",
  "telefone": "81 99999-9999",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "cidade": "Recife",
  "tamanho_camisa": "P",
  "autorizado": true
}
```

### 3. Relatório PDF (protegido)
```bash
GET /relatorio/pdf
Authorization: Bearer eyJhbGc...
```

## 🚨 Troubleshooting

### Erro: "DATABASE_URL não definido"
- Verifique se o arquivo `.env` existe
- Confira se `DATABASE_URL` está preenchido
- Reinicie o servidor após editar `.env`

### Erro: "ECONNREFUSED" ao conectar
- PostgreSQL não está rodando
- DATABASE_URL está incorreta
- Host não é acessível

### Erro: "Credenciais inválidas"
- Verifique usuario e senha
- Execute `node check-admins.js` para ver quem existe no banco

## 🌐 Deployment

### Render
1. Acesse https://render.com
2. Create → New Web Service
3. Conecte seu repositório GitHub
4. Defina as Environment Variables
5. Deploy automático

### Environment Variables no Render
```
DATABASE_URL = postgresql://...
JWT_SECRET = sua-chave-segura-aqui
DEFAULT_ADMIN_USER = admin
DEFAULT_ADMIN_PASS = SuaSenhaForte@@
PORT = 5000
```

## 📝 Scripts Úteis

```bash
# Iniciar servidor
npm start

# Verificar admins no banco
node check-admins.js

# Ver variáveis de ambiente carregadas
node -e "require('dotenv').config(); console.log(process.env)"
```

## 🔑 Boas Práticas de Segurança

✅ **Faça:**
- Use senhas fortes (12+ caracteres, com especiais)
- Guarde `.env` em lugar seguro
- Mude senhas periodicamente
- Use HTTPS em produção
- Valide inputs no backend
- Use JWT com expiração curta (24h)

❌ **Não faça:**
- Commit `.env` no Git
- Compartilhe credenciais por email/chat
- Use senhas fracas
- Exponha DATABASE_URL no código
- Desabilite CORS sem motivo
- Use senhas padrão em produção

## 📞 Suporte

Para problemas, verifique:
1. Console do servidor (logs)
2. Browser DevTools (F12)
3. Arquivo `SECURITY.md` para mais detalhes

---

**Última atualização:** 02/12/2025
