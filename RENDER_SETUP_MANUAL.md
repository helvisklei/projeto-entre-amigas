# 🔧 CONFIGURAÇÃO MANUAL DO RENDER - Passo a Passo

## ⚠️ PROBLEMA IDENTIFICADO

O Render não está em deploy porque as **Environment Variables não foram configuradas no Dashboard**.

## ✅ SOLUÇÃO - Configure Manualmente (5 min)

### PASSO 1: Acessar Dashboard do Render

1. Abra: https://dashboard.render.com
2. Faça login com sua conta Render

### PASSO 2: Encontrar o Serviço

1. Na esquerda, procure por "site-corrida-backend"
2. Se não aparecer, clique em "New +" e selecione "Web Service"
3. Conecte seu repositório: `helvisklei/projeto-entre-amigas`

### PASSO 3: Configurar o Serviço

Na página do serviço "site-corrida-backend", procure por:

**Build Settings:**
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
Clique em "Environment" e adicione cada uma:

#### 1️⃣ DATABASE_URL
```
Chave: DATABASE_URL
Valor: postgresql://inscricoes_entre_amigas_db_user:RYARX2HIBOidZD6MFUFoBiaaF09gWa1t@dpg-d4ac1hje5dus73a1cmig-a/inscricoes_entre_amigas_db
```

#### 2️⃣ JWT_SECRET
```
Chave: JWT_SECRET
Valor: sua-chave-secreta-super-segura-aqui-mude-em-producao
```

#### 3️⃣ DEFAULT_ADMIN_USER
```
Chave: DEFAULT_ADMIN_USER
Valor: admin
```

#### 4️⃣ DEFAULT_ADMIN_PASS
```
Chave: DEFAULT_ADMIN_PASS
Valor: HVK1080hvk@@
```

#### 5️⃣ PORT
```
Chave: PORT
Valor: 5000
```

### PASSO 4: Confirmar Configuração

1. Depois de adicionar TODAS as variáveis, clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. Você verá o status: "Deploying..." → "Deployed" (verde)

### PASSO 5: Verificar Deploy

Quando ficar verde ✅:

```powershell
powershell -ExecutionPolicy Bypass -File test-production-login.ps1
```

Se retornar um token JWT, está funcionando! 🎉

## 🎯 Resumo das Environment Variables

| Chave | Valor |
|-------|-------|
| `DATABASE_URL` | `postgresql://inscricoes_entre_amigas_db_user:RYARX2HIBOidZD6MFUFoBiaaF09gWa1t@dpg-d4ac1hje5dus73a1cmig-a/inscricoes_entre_amigas_db` |
| `JWT_SECRET` | `sua-chave-secreta-super-segura-aqui-mude-em-producao` |
| `DEFAULT_ADMIN_USER` | `admin` |
| `DEFAULT_ADMIN_PASS` | `HVK1080hvk@@` |
| `PORT` | `5000` |

## 🔍 Screenshots para Guiar

### Local de Environment Variables (Render Dashboard)
```
site-corrida-backend
├── Settings
├── Environment ← CLIQUE AQUI
├── Logs
└── Events
```

### Como Adicionar Variável
```
Name: DATABASE_URL
Value: postgresql://inscricoes_entre_amigas_db_user:...
[Add]
```

## 🚨 Troubleshooting

### "Não consigo achar site-corrida-backend no Render"

**Solução:**
1. Verifique se está logado na conta certa
2. Se não aparece nenhum serviço, crie novo:
   - "New +" → "Web Service"
   - Conecte repo: `helvisklei/projeto-entre-amigas`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`

### "Deploy parou em 'Building...'"

**Solução:**
1. Verifique "Logs" para erros
2. Procure por erro de npm ou node
3. Geralmente é falta de variáveis de ambiente

### "Erro: 'ENOTFOUND' nos logs"

**Solução:**
- DATABASE_URL não está correto
- Copie e cole EXATAMENTE a string acima
- Clique "Deploy" novamente

## ✅ Checklist Final

- [ ] Acessei dashboard.render.com
- [ ] Encontrei "site-corrida-backend"
- [ ] Adicionei DATABASE_URL
- [ ] Adicionei JWT_SECRET
- [ ] Adicionei DEFAULT_ADMIN_USER
- [ ] Adicionei DEFAULT_ADMIN_PASS
- [ ] Adicionei PORT
- [ ] Cliquei "Deploy"
- [ ] Status mudou para "Deployed" (verde)
- [ ] Teste retornou token JWT

## 📞 Próximo Passo

Depois que Deploy estiver verde:

```powershell
powershell -ExecutionPolicy Bypass -File test-production-login.ps1
```

Se funcionar, você verá:
```
✅ LOGIN BEM-SUCEDIDO!
Token recebido: eyJhbGc...
ID: 1
Usuario: admin
Email: admin@helvisklei.com
```

---

**Tempo estimado:** 5-10 minutos
**Dificuldade:** Fácil (copy & paste)
