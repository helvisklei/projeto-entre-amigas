# 🔗 URLs de Configuração para Google Forms

## URL de Redirecionamento Automático

Quando o usuário **clica em "Concluir"** no Google Forms, configure para redirecionar para esta URL:

### 🌐 URL para Colocar na Configuração do Google Forms

```
https://seu-site.vercel.app?fromForm=true
```

**Substitua `seu-site` pelo seu domínio Vercel real!**

Exemplos:
- ✅ `https://entre-amigas.vercel.app?fromForm=true`
- ✅ `https://site-corrida.vercel.app?fromForm=true`
- ✅ `https://seu-dominio-customizado.com?fromForm=true`

---

## Como Configurar no Google Forms

### Passo 1: Abrir as Configurações do Formulário
1. Acesse seu Google Forms: https://forms.google.com/
2. Abra o formulário de inscrição
3. Clique em ⚙️ **Configurações** (ícone de engrenagem no topo)

### Passo 2: Ir para a Aba "Respostas"
- Clique na aba **"Respostas"**

### Passo 3: Configurar Redirecionamento
Procure pela opção: **"Depois de enviar o formulário"**

```
┌─────────────────────────────────────────────────────┐
│ Depois de enviar o formulário:                       │
│                                                      │
│ ○ Mostrar mensagem de confirmação                   │
│ ○ Ir para página da web                             │
│   [https://seu-site.vercel.app?fromForm=true]      │
│                                                      │
│ ✓ Permitir responder novamente                      │
└─────────────────────────────────────────────────────┘
```

### Passo 4: Selecionar Opção
- Marque a opção: **"Ir para página da web"**
- Cole a URL no campo abaixo

### Passo 5: Salvar
- Clique em **"Salvar"** no canto superior direito

---

## O Que Acontece Depois

### Fluxo Completo:

```
1️⃣ Usuário preenche o formulário
            ⬇️
2️⃣ Clica em "Enviar" / "Concluir"
            ⬇️
3️⃣ Google Forms registra a resposta ✓
            ⬇️
4️⃣ Redireciona para: https://seu-site.vercel.app?fromForm=true
            ⬇️
5️⃣ JavaScript detecta: ?fromForm=true
            ⬇️
6️⃣ Modal automaticamente mostra: "Formulário Preenchido! ✅"
            ⬇️
7️⃣ Opções de pagamento aparecem
            ⬇️
8️⃣ Usuário escolhe: Pagar, Já Paguei, ou Pago Depois
```

---

## Duas Formas de Retorno Automático

### 🔵 **OPÇÃO 1: Via Redirecionamento (Recomendado)**

**Configuração**: Cole a URL no Google Forms
```
https://seu-site.vercel.app?fromForm=true
```

**Vantagem**:
- ✅ Automático 100%
- ✅ Sem delay
- ✅ Funciona em qualquer navegador
- ✅ Profissional

**O que acontece**:
```
[Enviar] → Redireciona automaticamente → Modal aparece
```

---

### 🟢 **OPÇÃO 2: Via Detecção de Foco (Backup)**

Se NÃO configurar redirecionamento, o sistema ainda funciona:

**Como funciona**:
```
[Enviar] → Usuário volta à aba original
         → JavaScript detecta: window.focus()
         → Verifica: "Há menos de 5 minutos?"
         → Modal aparece automaticamente
```

**Vantagem**:
- ✅ Funciona mesmo sem redirecionamento configurado
- ✅ Suporta usuários que voltam manualmente

---

## Opção para Usuário Voltar Manualmente

Se por algum motivo a detecção automática não funcionar, existe um **botão dourado** que aparece:

```
┌──────────────────────────────────────────────────────────┐
│  📋 INSCRICAO MODAL                                      │
│                                                           │
│  [📋 Abrir Google Forms]                                │
│                                                           │
│  [✓ Já Preencheu? Avançar para Pagamento]              │
│  (Aparece APENAS se o formulário está aberto)          │
│                                                           │
│  [Cancelar]                                              │
└──────────────────────────────────────────────────────────┘
```

**Quando aparece**: Quando a aba do Google Forms está aberta
**Como usar**: Clique quando terminar de preencher o formulário

---

## Teste Rápido

### Antes de Publicar:

1. **Abra o site localmente**:
   ```bash
   cd site-corrida/frontend
   npm start
   ```

2. **Teste o fluxo**:
   - Clique "Se inscreva você também!"
   - Clique "📋 Abrir Google Forms"
   - **Opção A**: Preencha o formulário e clique "Enviar" → Observe a URL
   - **Opção B**: Se não redirecionar, clique o botão dourado "✓ Já Preencheu?"
   - Modal deve mostrar opções de pagamento ✅

---

## URLs Importantes

| Contexto | URL |
|----------|-----|
| Seu site (produção) | https://seu-site.vercel.app |
| Site + parâmetro retorno | https://seu-site.vercel.app?fromForm=true |
| Local (desenvolvimento) | http://localhost:3000 |
| Local + parâmetro retorno | http://localhost:3000?fromForm=true |

---

## Troubleshooting

### ❌ "O Google Forms não redireciona"

**Solução**:
1. Verifique se marcou a opção "Ir para página da web"
2. Verifique se a URL está correta (sem typos)
3. Salve as configurações clicando em "Salvar"
4. Teste em uma aba anônima/privada

### ❌ "Redireciona mas o modal não aparece"

**Solução**:
1. Verifique se o modal está aberto quando você preenche
2. Verifique no console (F12) se há erros JavaScript
3. O parâmetro `?fromForm=true` deve estar na URL

### ❌ "Usuário não quer que redirecione"

**Solução**:
- Deixe a opção "Mostrar mensagem de confirmação" (padrão)
- O sistema detectará automaticamente quando o usuário volta
- O botão dourado "✓ Já Preencheu?" sempre funciona

---

## Resumo para Configurar Agora

1. **Abra Google Forms**: https://forms.google.com/
2. **Vá a**: ⚙️ Configurações → Respostas
3. **Marque**: "Ir para página da web"
4. **Cole esta URL**:
   ```
   https://seu-site.vercel.app?fromForm=true
   ```
   (Substitua `seu-site` pelo seu domínio real)
5. **Clique**: Salvar

**Pronto!** ✅ Quando o usuário concluir o formulário, volta automaticamente ao modal de pagamento.

