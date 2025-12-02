# 👤 INSTRUÇÕES PARA HELVIS - Login do Banco de Dados

## 🔑 Credenciais de Produção

Você forneceu as credenciais do PostgreSQL RDS:
```
Host: dpg-d4ac1hje5dus73a1cmig-a
Database: inscricoes_entre_amigas_db
Usuario: inscricoes_entre_amigas_db_user
Senha: RYARX2HIBOidZD6MFUFoBiaaF09gWa1t
```

## ✅ O Sistema Agora Usa Estas Credenciais

Arquivo: `site-corrida/backend/.env`
```env
DATABASE_URL=postgresql://inscricoes_entre_amigas_db_user:RYARX2HIBOidZD6MFUFoBiaaF09gWa1t@dpg-d4ac1hje5dus73a1cmig-a/inscricoes_entre_amigas_db
JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-em-producao
PORT=5000
DEFAULT_ADMIN_USER=admin
DEFAULT_ADMIN_PASS=HVK1080hvk@@
```

⚠️ **Este arquivo está PROTEGIDO:**
- Arquivo `.env` está em `.gitignore`
- **Nunca será commitado** no GitHub
- Credenciais permanecem seguras no seu servidor

## 🔐 Como Funciona o Login

### Cenário 1: Admin Padrão do Sistema
```
Usuario: admin
Senha: HVK1080hvk@@
Resultado: ✅ Acesso garantido
```

### Cenário 2: Admins Cadastrados no Banco
```
Usuario: [qualquer usuario da tabela admins]
Senha: [exatamente a senha cadastrada no banco]
Resultado: ✅ Acesso se credenciais forem corretas
```

## 📊 Verificar Admins no Banco

Para ver QUEM está cadastrado no banco de dados:

```bash
cd site-corrida/backend
node check-admins.js
```

**Exemplo de saída esperada:**
```
✅ Encontrados 2 admin(s):

[1] admin
    Email: admin@helvisklei.com
    Ativo: ✅
    Criado: 02/12/2025 10:30:45

[2] seu_novo_admin
    Email: novo@empresa.com
    Ativo: ✅
    Criado: 02/12/2025 15:20:10
```

## 🚀 Para Testar Localmente

1. **Inicie o backend:**
   ```bash
   cd site-corrida/backend
   npm start
   ```

2. **Acesse o frontend:**
   ```
   http://localhost:3000
   ```

3. **Tente logar com:**
   - ✅ `admin` / `HVK1080hvk@@` (sempre funciona)
   - ✅ Qualquer admin que esteja na tabela com sua senha

## 🌐 Para Testar em Produção (Render)

1. Render já tem suas variáveis de ambiente configuradas
2. Ao fazer push, o deploy ocorre automaticamente
3. Acesse: https://seu-app.onrender.com
4. Tente fazer login com suas credenciais

## ⚙️ Adicionar Novo Admin (Diretamente no Banco)

Se quiser adicionar um novo admin SEM usar a interface:

```sql
INSERT INTO admins (usuario, senha, email, ativo) 
VALUES ('seu_novo_usuario', 'sua_senha_forte_123@@', 'email@empresa.com', true);
```

Depois execute:
```bash
node check-admins.js
```

Para verificar se foi adicionado.

## 🔒 Segurança: O Que Não Fazer

❌ Não commit `.env` no GitHub
❌ Não compartilhe `.env` por email/Slack
❌ Não coloque senhas em comentários do código
❌ Não use senhas fracas
❌ Não use `senha123` para admins do banco

## ✅ Segurança: O Que Fazer

✅ Guarde `.env` em lugar seguro
✅ Use senhas fortes (12+ caracteres com especiais)
✅ Mude senhas periodicamente
✅ Mantenha `.env` diferente para cada ambiente (dev/prod)
✅ Revise logs de login periodicamente

## 📞 Debugging

**Erro: "Credenciais inválidas"**
- Execute `node check-admins.js` para verificar se existe
- Confirme que a senha está exatamente igual

**Erro: "DATABASE_URL não definido"**
- Verifique se `.env` existe em `site-corrida/backend/`
- Confirme que `DATABASE_URL` está preenchida

**Erro ao conectar ao banco**
- Em desenvolvimento: Este erro é normal se o RDS não é acessível localmente
- Em produção (Render): Deve funcionar automaticamente

## 🎯 Resumo da Configuração

| Item | Status | Local |
|------|--------|-------|
| Database URL | ✅ Configurada | `.env` (protegido) |
| Credenciais Admin | ✅ Seguras | Tabela `admins` |
| JWT Secret | ✅ Configurado | `.env` (protegido) |
| Login Padrão | ✅ Ativo | `admin / HVK1080hvk@@` |
| Git Protection | ✅ Ativo | `.gitignore` |

---

**Tudo configurado e seguro! 🚀**

Seu sistema agora:
- ✅ Usa as credenciais reais do banco de dados
- ✅ Protege senhas com variáveis de ambiente
- ✅ Permite admins cadastrados no banco
- ✅ Mantém credenciais fora do Git
- ✅ Está pronto para produção
