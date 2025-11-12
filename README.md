# Entre Amigas - Corrida 2026 🏃‍♀️

Plataforma web para gerenciar inscrições da 5ª edição da Corrida Entre Amigas.

## 🚀 Tecnologias

- **Frontend:** React 19, Tailwind CSS, React Router v6
- **Backend:** Node.js, Express, PostgreSQL
- **Deploy:** Vercel (Frontend), Render (Backend)
- **Relatórios:** Excel (ExcelJS), PDF (PDFKit)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- Git
- Contas em GitHub, Vercel e Render

## 🛠️ Instalação Local

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm start
# Acessa http://localhost:3000
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL no .env
npm start
# API roda em http://localhost:3001
```

## 📝 Variáveis de Ambiente

### Frontend (.env.local)

```
REACT_APP_API_URL=http://localhost:3001
```

### Backend (.env)

```
DATABASE_URL=postgres://usuario:senha@host:porta/dbname
ADMIN_USER=admin
ADMIN_PASS=senha123
PORT=3001
```

## 🔐 Segurança

- Credenciais do admin não são expostas no frontend
- Senhas são armazenadas com hash em produção (implementar bcrypt)
- CORS configurado para domínios específicos
- Variáveis sensíveis apenas em `.env`
- `.gitignore` exclui `.env` e `node_modules`

## 🚀 Deploy

### Vercel (Frontend)

1. Conecte seu repositório GitHub no Vercel
2. Configure variáveis de ambiente:
   - `REACT_APP_API_URL=https://seu-backend.onrender.com`
3. Deploy automático em cada push

### Render (Backend)

1. Crie novo Web Service no Render
2. Conecte seu repositório GitHub
3. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Adicione variáveis de ambiente:
   - `DATABASE_URL` (PostgreSQL do Render)
   - `ADMIN_USER`
   - `ADMIN_PASS`

## 📊 Funcionalidades

- ✅ Inscrição com validação
- ✅ Painel administrativo protegido
- ✅ Listagem de inscritos
- ✅ Relatórios em Excel e PDF
- ✅ Integração Pix (via Mercado Pago)
- ✅ Autenticação simples

## 🔄 Workflow Git

```bash
# Clonar
git clone https://github.com/seu-usuario/projeto-entre-amigas.git

# Atualizar
git pull origin main

# Criar branch
git checkout -b feature/nova-funcionalidade

# Commitar
git add .
git commit -m "feat: descrição da alteração"

# Push
git push origin feature/nova-funcionalidade

# Pull Request no GitHub
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/seu-usuario/projeto-entre-amigas/issues).

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Entre Amigas, toda corrida tem mais significado.** 💕
