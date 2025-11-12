# Guia Completo de Deploy

## 📋 Passo a Passo

### 1️⃣ Preparar Repositório GitHub

```bash
# Na raiz do projeto
git init
git add .
git commit -m "Initial commit: Entre Amigas platform"
git branch -M main
git remote add origin https://github.com/seu-usuario/projeto-entre-amigas.git
git push -u origin main
```

### 2️⃣ Deploy Backend no Render

#### Pré-requisito: PostgreSQL

1. **Criar banco no Render:**
   - Acesse [render.com](https://render.com)
   - Clique em "+ New"
   - Selecione "PostgreSQL"
   - Nome: `corrida-amigas-db`
   - Region: Oregon (mais barato)
   - Plan: Starter/Starter (free)
   - Criar banco
   - Copiar `Internal Database URL` (este será seu `DATABASE_URL`)

2. **Deploy do Backend:**
   - Em Render, clique "+ New" → "Web Service"
   - Selecione seu repositório GitHub
   - Name: `site-corrida-backend`
   - Environment: Node
   - Region: Oregon
   - Plan: Starter (free)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Clique "+ Add Environment Variable":
     - `DATABASE_URL`: (cole a URL do PostgreSQL)
     - `ADMIN_USER`: `admin`
     - `ADMIN_PASS`: (gere uma senha forte)
   - Deploy

3. **Após deploy:**
   - Copie a URL do serviço (exemplo: `https://site-corrida-backend.onrender.com`)
   - Use esta URL no frontend

### 3️⃣ Deploy Frontend na Vercel

1. **Conectar repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique "Import Project"
   - Selecione "Continue with GitHub"
   - Escolha seu repositório
   - Clique "Import"

2. **Configuração:**
   - Root Directory: `frontend`
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables:**
   - `REACT_APP_API_URL`: (URL do seu backend no Render)
   - Exemplo: `https://site-corrida-backend.onrender.com`

4. **Deploy:**
   - Clique "Deploy"
   - Aguarde a build terminar

### 4️⃣ Testar em Produção

```bash
# Abra seu navegador e acesse:
https://seu-projeto.vercel.app

# Teste o fluxo:
1. Ir para Home
2. Preencher formulário e inscrever
3. Ir para Login (admin/senha)
4. Ver inscrição no Admin
5. Testar relatórios (PDF/Excel)
```

## 🔐 Segurança - Checklist

- [ ] `.env` está no `.gitignore`
- [ ] `.env.example` existe como referência (sem valores reais)
- [ ] Senhas do admin são diferentes em produção
- [ ] DATABASE_URL é a URL interna do Render PostgreSQL
- [ ] CORS está configurado apenas para seu domínio
- [ ] Não há console.logs sensíveis no código
- [ ] Certificado HTTPS está ativo (Vercel/Render fazem automaticamente)

## 🔄 Atualizações Futuras

Após fazer mudanças:

```bash
git add .
git commit -m "feat: descrição da mudança"
git push origin main
```

**Vercel e Render farão deploy automático!**

## 🆘 Troubleshooting

### Backend retorna 403 CORS
- Atualize `REACT_APP_API_URL` no frontend
- Reinicie o deploy da Vercel

### Banco PostgreSQL vazio
- Conecte ao banco pelo psql ou DBeaver
- Execute:
  ```sql
  CREATE TABLE IF NOT EXISTS inscricoes (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    telefone TEXT,
    email TEXT,
    autorizado BOOLEAN,
    pago BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

### Erro 502 no Render
- Verifique `DATABASE_URL` está correto
- Verifique logs no Render: "Logs" → tela do serviço

## 📊 Monitoramento

- **Vercel:** Deployment history em https://vercel.com/dashboard
- **Render:** Logs em tempo real na tela do serviço
- **PostgreSQL:** Visualize dados em https://render.com/dashboard

## 💰 Estimativa de Custos

- **Vercel:** Free (até 100 GB bandwidth/mês)
- **Render:** Free (instâncias dormem após 15 min inatividade)
- **PostgreSQL (Render):** Free (até 90 dias, depois $9/mês)

---

**Dúvidas? Abra uma issue no GitHub!** 💬
