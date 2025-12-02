# 🚀 GUIA DE TESTES EM PRODUÇÃO

## 📋 Checklist de Configuração Pré-Testes

Antes de testar, certifique-se que:

- [ ] Código foi commitado e feito push para GitHub
- [ ] Render Dashboard mostra status "Deployed" (verde)
- [ ] Environment Variables foram adicionadas ao Render:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `DEFAULT_ADMIN_USER`
  - [ ] `DEFAULT_ADMIN_PASS`
  - [ ] `PORT=5000`

## 🧪 TESTE 1: Status do Deploy

### Opção 1: Via Script PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File check-production-status.ps1
```

### Opção 2: Manual via Dashboard

1. Abra: https://dashboard.render.com
2. Procure por "site-corrida-backend"
3. Verifique:
   - Status (deve estar **Deployed** em verde)
   - Logs (procure por erros)
   - Environment Variables (todas presentes?)

## 🔐 TESTE 2: Login em Produção

### Via Script PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File test-production-login.ps1
```

### Via cURL (Manual)

```bash
curl -X POST https://site-corrida-backend.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"HVK1080hvk@@"}'
```

### Resultado Esperado

**Sucesso (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": "admin",
  "id": 1,
  "email": "admin@helvisklei.com"
}
```

**Erro (401 Unauthorized):**
```json
{
  "message": "Usuário ou senha inválidos"
}
```

**Erro (404 Not Found):**
- Backend não está rodando
- Aguarde 2-3 minutos para deploy completar

## 🌐 TESTE 3: Verificar Frontend

### URL de Produção
```
https://site-corrida.vercel.app
```

### Teste de Login
1. Acesse o site
2. Clique em "Painel Admin" ou navegue para `/admin`
3. Tente logar com:
   - Usuário: `admin`
   - Senha: `HVK1080hvk@@`

### Resultado Esperado
- ✅ Login bem-sucedido
- ✅ Redirecionado para painel admin
- ✅ Pode visualizar inscrições

## 🔍 TESTE 4: Verificar Banco de Dados

### No Render Dashboard

1. Abra o serviço "site-corrida-backend"
2. Vá para "Logs"
3. Procure por uma dessas mensagens:

**Sucesso:**
```
✅ Login com credencial padrão do sistema
```

**Erro de Conexão:**
```
❌ getaddrinfo ENOTFOUND dpg-d4ac1hje5dus73a1cmig-a
```

## ⚙️ TESTE 5: Endpoints da API

### Inscrição (POST /inscricao)

```bash
curl -X POST https://site-corrida-backend.onrender.com/inscricao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Producao",
    "telefone": "81 99999-9999",
    "email": "teste@email.com",
    "cpf": "123.456.789-00",
    "cidade": "Recife",
    "tamanho_camisa": "P",
    "autorizado": true
  }'
```

### Relatório PDF (GET /relatorio/pdf)

```bash
# Primeiro faça login para obter o token
TOKEN=$(curl -s -X POST https://site-corrida-backend.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"HVK1080hvk@@"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Agora use o token para gerar o PDF
curl -X GET https://site-corrida-backend.onrender.com/relatorio/pdf \
  -H "Authorization: Bearer $TOKEN" \
  -o relatorio.pdf
```

## 📊 TESTE 6: Verificar Admins no Banco

### Localmente (Desenvolvimento)

```bash
cd site-corrida/backend
node check-admins.js
```

### Em Produção (Via Render Logs)

1. Render Dashboard → site-corrida-backend → Logs
2. Procure por mensagens de login
3. Verifique se mostra "✅ Login bem-sucedido"

## 🚨 TROUBLESHOOTING

### Erro 404 - Endpoint Não Localizado

**Causa:** Backend ainda está em deploy
**Solução:** Aguarde 2-3 minutos, tente novamente

### Erro 401 - Credenciais Inválidas

**Causa:** Senha ou usuário incorretos
**Solução:** 
- Verifique se está usando `admin` e `HVK1080hvk@@`
- Se ainda falhar, verifique DATABASE_URL em Environment Variables

### Erro de Conexão ao Banco

**Mensagem no log:**
```
getaddrinfo ENOTFOUND dpg-d4ac1hje5dus73a1cmig-a
```

**Causa:** DATABASE_URL não está configurada em Render
**Solução:**
1. Render Dashboard → Environment
2. Adicione: `DATABASE_URL=postgresql://inscricoes_entre_amigas_db_user:RYARX2HIBOidZD6MFUFoBiaaF09gWa1t@dpg-d4ac1hje5dus73a1cmig-a/inscricoes_entre_amigas_db`
3. Clique "Deploy"

### CORS Error no Frontend

**Erro no console do navegador:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solução:** CORS já está configurado no backend. Limpe cache e tente novamente.

## ✅ Checklist de Testes Completos

- [ ] Deploy em Render está verde (Deployed)
- [ ] Script `test-production-login.ps1` retorna token válido
- [ ] Frontend consegue logar em produção
- [ ] Inscrições podem ser criadas via API
- [ ] Relatório PDF pode ser gerado
- [ ] Logs mostram "✅ Login bem-sucedido"
- [ ] Nenhum erro 500 nos logs

## 📝 Registrar Resultado dos Testes

Se tudo passou ✅:
```
✅ Sistema está funcionando em produção!
- Backend: https://site-corrida-backend.onrender.com
- Frontend: https://site-corrida.vercel.app
- Admin padrão: admin / HVK1080hvk@@
- Banco de dados: RDS PostgreSQL conectado
```

Se houver ❌:
```
❌ Erro encontrado: [DESCREVER O ERRO]
- Endpoint: [URL TESTADA]
- Status HTTP: [CÓDIGO]
- Mensagem: [ERRO RETORNADO]
- Próximo passo: [AÇÃO PARA RESOLVER]
```

## 📞 Suporte

Para mais informações:
- SECURITY_SUMMARY.md - Resumo de segurança
- INSTRUCOES_HELVIS.md - Instruções personalizadas
- site-corrida/backend/README.md - Documentação do backend
- site-corrida/backend/SECURITY.md - Guia de segurança

---

**Última atualização:** 02/12/2025
