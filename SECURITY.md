# Guia de Segurança

## 🔐 Princípios Gerais

1. **Nunca commit de segredos**
   - `.env` SEMPRE no `.gitignore`
   - `.env.example` com valores de exemplo
   - `.env.local` para desenvolvimento

2. **Senhas Fortes**
   - Gere senhas com 16+ caracteres
   - Inclua números, letras (maiúsculas/minúsculas), símbolos
   - Ferramentas: [random.org/passwords](https://www.random.org/passwords/)

3. **Variáveis de Ambiente por Plataforma**

### Frontend (Vercel)
- Apenas variáveis **públicas** (prefixo `REACT_APP_`)
- Nunca exponha chaves de API ou tokens

### Backend (Render)
- Configure via painel do Render
- Nunca deixe em código ou comentários

## 🛡️ Checklist de Segurança

### Antes de fazer Push

```bash
# Verificar se há arquivos sensíveis
git status

# Não deve mostrar:
# - .env
# - node_modules
# - .DS_Store
# - Arquivos com senhas/tokens
```

### Verificar .gitignore

```bash
# Ver o que será ignorado
git check-ignore -v *
```

### Se acidentalmente fez commit de segredo

```bash
# Remove do Git (mas keep no disco)
git rm --cached .env
git commit -m "Remove .env from tracking"

# Ou remove completamente do histórico
git filter-branch --tree-filter 'rm -f .env' HEAD
git push origin --force-with-lease
```

## 🔑 Credenciais em Produção

### Admin Credentials
- **Local:** `admin / senha123` (apenas teste)
- **Produção:** Defina senhas diferentes via ambiente

### Database
- Use PostgreSQL gerenciado (Render, AWS RDS, etc.)
- Nunca a senha no código
- Use URL de conexão na variável de ambiente

### API Keys
- Se usar Mercado Pago/SendGrid: guardar em `.env`
- Acessar via `process.env.CHAVE_API`

## 📝 Exemplo de Segurança

### ❌ ERRADO
```javascript
// server.js
const DB_USER = 'admin';
const DB_PASS = 'senha123'; // NÃO FAÇA ISSO!
```

### ✅ CORRETO
```javascript
// server.js
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
```

```bash
# .env
DB_USER=admin
DB_PASS=sua_senha_segura
```

## 🚨 Monitoramento

### GitHub
- Ative "Secret scanning" nas configurações do repositório
- GitHub alertará se detectar senhas expostas

### Render
- Configure alertas para erros de autenticação
- Monitore logs de 403/401 (acesso negado)

## 🔄 Rotação de Credenciais

A cada 3-6 meses:

1. Gere nova senha do admin
2. Atualize em Render
3. Notifique usuários de mudança

## 📚 Recursos Úteis

- [OWASP Security Guidelines](https://owasp.org/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

**Segurança em primeiro lugar!** 🛡️
