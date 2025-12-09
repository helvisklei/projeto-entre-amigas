# 📝 GUIA: Criar Formulário no Google Forms

## 🎯 Objetivo

Integrar Google Forms como sistema de inscrição alternativo, mantendo dados seguros e com limite de 100 inscrições.

## ✅ PASSO 1: Criar o Formulário no Google Forms

### 1.1 Acessar Google Forms
1. Abra: https://forms.google.com
2. Clique em **"+"** (Criar novo formulário)
3. Nomeie: **"Inscrição - Corrida Entre Amigas 2025"**

### 1.2 Adicionar Campos

**Clique em "+"** para adicionar cada pergunta:

#### Campo 1: Nome Completo
- **Tipo:** Resposta curta
- **Pergunta:** "Qual seu nome completo?"
- **Obrigatório:** ✅ Sim

#### Campo 2: Telefone
- **Tipo:** Resposta curta
- **Pergunta:** "Qual seu telefone? (com DDD)"
- **Obrigatório:** ✅ Sim
- **Validação:** Números

#### Campo 3: Email
- **Tipo:** Resposta curta
- **Pergunta:** "Qual seu email?"
- **Obrigatório:** ✅ Sim
- **Validação:** Email

#### Campo 4: CPF
- **Tipo:** Resposta curta
- **Pergunta:** "Qual seu CPF? (apenas números)"
- **Obrigatório:** ✅ Não

#### Campo 5: Cidade
- **Tipo:** Resposta curta
- **Pergunta:** "Qual sua cidade?"
- **Obrigatório:** ✅ Não

#### Campo 6: Tamanho da Camiseta
- **Tipo:** Múltipla escolha
- **Pergunta:** "Qual tamanho de camiseta?"
- **Opções:** 
  - P (Pequeno)
  - M (Médio)
  - G (Grande)
  - GG (Extra Grande)
- **Obrigatório:** ✅ Não

### 1.3 Configurar Limite de 100 Respostas

1. Clique em **⚙️ Configurações**
2. Vá para **Apresentação**
3. Procure por **"Limite de respostas"**
4. Ative e defina para **100**
5. Mensagem ao atingir: _"Inscrições encerradas. Próximo evento: Setembro 2025"_

### 1.4 Ativar Google Sheet Automático

1. Clique em **"Respostas"**
2. Clique no ícone **📊** (Google Sheets)
3. Selecione **"Criar nova planilha"**
4. Escolha um nome: **"Respostas - Corrida Entre Amigas"**

**Resultado:** Google Forms salvará automaticamente todas as respostas em uma planilha!

## 🔗 PASSO 2: Obter URL do Formulário

### 2.1 Copiar Link Compartilhável
1. Clique no **botão de compartilhamento** (🔗)
2. Copie o link público
3. Salve em um arquivo seguro

### 2.2 Copiar URL para Pré-preenchimento
1. No formulário, clique em **"Enviar"** (botão superior direito)
2. Copie o link

## 🔐 PASSO 3: Configurar Segurança

### 3.1 Proteção do Formulário
1. **Configurações** → **Segurança**
2. Ativar:
   - ✅ **Exigir login do Google** (só quem tem Gmail)
   - ✅ **Impedir respostas duplicadas**

### 3.2 Permissões da Planilha
1. Abra a planilha criada
2. Clique em **Compartilhar**
3. Adicione apenas seu email (privado)
4. **Nunca** compartilhe com público

## 🚀 PASSO 4: Integrar com Seu Sistema

### 4.1 Encontrar IDs dos Campos

1. Acesse o formulário em **modo edição**
2. Clique em **"Mais"** (⋮) → **"Código pré-preenchimento"**
3. Você verá URLs como:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd...form_id.../viewform?entry.123456789=valor
   ```

4. Os números após `entry.` são os IDs dos campos:
   - `entry.123456789` = Nome
   - `entry.987654321` = Telefone
   - `entry.111111111` = Email
   - etc.

### 4.2 Mapear Campo IDs

Crie um arquivo `google-forms-config.json`:
```json
{
  "formId": "1FAIpQLSd...", 
  "entryIds": {
    "nome": "123456789",
    "telefone": "987654321",
    "email": "111111111",
    "cpf": "222222222",
    "cidade": "333333333",
    "tamanho_camisa": "444444444"
  }
}
```

## 📋 PASSO 5: Configurar .env do Backend

```bash
# Backend/.env

# URL do formulário Google (obter de Enviar → Link)
GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSd...form_id.../formResponse

# IDs dos campos (encontrados no pré-preenchimento)
GOOGLE_FORM_ENTRIES={
  "nome": "123456789",
  "telefone": "987654321", 
  "email": "111111111",
  "cpf": "222222222",
  "cidade": "333333333",
  "tamanho_camisa": "444444444"
}
```

## ✅ PASSO 6: Testar Integração

### Via cURL:
```bash
curl -X POST http://localhost:5000/inscricao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Silva",
    "telefone": "81 99999-9999",
    "email": "teste@email.com",
    "cpf": "123.456.789-00",
    "cidade": "Recife",
    "tamanho_camisa": "M"
  }'
```

### Via Frontend:
1. Preencha o formulário normalmente
2. Verifique Google Forms (respostas aparecem automaticamente)
3. Verifique Google Sheet (dados sincronizados)

## 🎉 FLUXO COMPLETO

```
Usuário preenche formulário
    ↓
Frontend envia dados via API
    ↓
Backend valida dados (100 inscrições?)
    ↓
├─ Salva no banco de dados PostgreSQL (local)
└─ Envia para Google Forms (online)
    ↓
Google Forms salva automaticamente na planilha
    ↓
✅ Inscrição confirmada!
```

## 🔒 Segurança Implementada

✅ **Backend:**
- Validação de email
- Limite de 100 inscrições
- Tratamento de erros
- Logs de inscrições

✅ **Google Forms:**
- Requer login Google
- Impede respostas duplicadas
- Limite de 100 respostas automático
- Dados em planilha privada

✅ **Dados:**
- Locais: Banco de dados PostgreSQL (seguro)
- Online: Google Forms (hospedado no Google)
- Backup: Planilha Google (sincronizada)

## 📊 Monitorar Respostas

### No Google Forms:
1. Clique em **"Respostas"**
2. Veja:
   - Total de respostas
   - Respostas mais recentes
   - Gráficos de dados

### Na Planilha Google:
1. Abra a planilha criada
2. Veja todas as respostas em linhas
3. Crie gráficos e análises

## 🚨 Troubleshooting

### "Erro ao enviar para Google Forms"
- Verifique URL do formulário
- Confirme IDs dos campos
- Teste URL manualmente no navegador

### "Respostas não aparecem no Google Forms"
- Confirme limite de 100 não foi atingido
- Verifique se formulário está ativo
- Veja logs do servidor

### "Google Sheet não está sincronizando"
- Abra Google Forms → Respostas → 📊
- Clique em "Abrir planilha"
- Sincronização é automática

## 📞 Suporte

- **Google Forms Help:** https://support.google.com/docs/answer/7322334
- **Google Sheets Help:** https://support.google.com/docs/answer/6281219

---

**Status:** ✅ Sistema de formulário pronto para uso!
