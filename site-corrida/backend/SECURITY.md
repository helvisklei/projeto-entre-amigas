# 🔐 Configuração de Segurança - Backend

## ⚠️ IMPORTANTE: Variáveis de Ambiente

O arquivo `.env` **NUNCA deve ser commitado** ao repositório Git. Ele contém credenciais sensíveis.

## 📋 Setup Inicial

### 1. Copiar o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Editar `.env` com suas credenciais
```bash
# Usar o editor de sua preferência
nano .env
# ou
code .env
```

### 3. Preencher as variáveis
```env
# Banco de dados (obrigatório em produção)
DATABASE_URL=postgresql://usuario:senha@host:5432/banco

# JWT Secret - Use uma chave FORTE e ÚNICA
JWT_SECRET=sua-chave-criptografica-super-segura-aqui

# Admin padrão (seed inicial)
DEFAULT_ADMIN_USER=admin
DEFAULT_ADMIN_PASS=SuaSenhaForte@@123
```

## 🔍 Verificar Admins no Banco

Para ver quais admins estão cadastrados:
```bash
node check-admins.js
```

## 🚀 Iniciar o Servidor

```bash
npm install
npm start
```

## 📊 Fluxo de Login

```
1. Usuário tenta fazer login
   ↓
2. Backend verifica credenciais:
   ├─ Se user=DEFAULT_ADMIN_USER E pass=DEFAULT_ADMIN_PASS
   │  └─ ✅ Login bem-sucedido (seed/fallback)
   │
   └─ Senão, busca na tabela admins do banco
      ├─ Se usuário encontrado e senha coincide
      │  └─ ✅ Login bem-sucedido
      └─ Senão
         └─ ❌ Credenciais inválidas
```

## 🛡️ Boas Práticas

- ✅ Use senhas fortes (mínimo 12 caracteres com especiais)
- ✅ Mude `JWT_SECRET` e `DEFAULT_ADMIN_PASS` em produção
- ✅ Guarde `.env` em local seguro
- ✅ Não compartilhe credenciais por email/Slack
- ✅ Rotacione senhas periodicamente
- ✅ Use `.env.example` como template apenas

## 🔄 Em Produção (Render/Vercel)

1. Acesse o dashboard do seu serviço
2. Vá para Environment Variables
3. Adicione cada variável do `.env`
4. Deploy automático ocorre

Exemplo (Render):
- Project Settings → Environment
- Adicionar: `DATABASE_URL`, `JWT_SECRET`, etc.
