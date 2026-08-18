# 🚀 Setup Completo - Diagnóstico LEAD com Email Automático

## 📋 Passo a Passo

### **PASSO 1: Criar conta Resend (Serviço de Email Gratuito)**

1. Acesse: https://resend.com
2. Clique em "Sign Up"
3. Use seu email Gmail (paulo@pauloalbuquerque.com.br)
4. Complete o cadastro
5. Vá para **Settings → API Keys**
6. Copie a chave `re_...` (salve em um lugar seguro)

### **PASSO 2: Configurar Netlify Environment Variables**

1. Acesse seu site no Netlify: https://app.netlify.com
2. Clique em seu site
3. Vá para **Site Settings → Build & Deploy → Environment**
4. Clique em **Edit variables**
5. Adicione estas 2 variáveis:

```
RESEND_API_KEY = re_xxxxxxxxxxxx (copie de Resend)
ADMIN_EMAIL = paulo@pauloalbuquerque.com.br
```

6. Salve

### **PASSO 3: Estrutura de Pastas do Seu Repositório Git**

Seu repositório no GitHub/GitLab deve ter esta estrutura:

```
seu-repo/
├── index.html (arquivo HTML da aplicação)
├── netlify.toml (arquivo de configuração)
└── netlify/
    └── functions/
        └── send-email.js (função serverless)
```

### **PASSO 4: Criar arquivo `netlify.toml`**

Na raiz do seu repositório, crie um arquivo `netlify.toml`:

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### **PASSO 5: Colocar arquivo HTML no repositório**

1. Renomeie `lead-diagnostic-v2.html` para `index.html`
2. Coloque na raiz do repositório
3. Crie a pasta `netlify/functions/`
4. Coloque `send-email.js` dentro dela

### **PASSO 6: Fazer Deploy**

```bash
git add .
git commit -m "feat: Add LEAD diagnostic with email automation"
git push origin main
```

Netlify vai fazer deploy automaticamente!

### **PASSO 7: Testar**

1. Acesse seu site no Netlify (ex: meu-site.netlify.app)
2. Preencha o formulário
3. Responda as 12 questões
4. Clique em "📧 Enviar Resultado por E-mail"
5. Verifique:
   - Seu email Gmail (você recebe sumário)
   - Email do respondente (ele recebe o relatório)

---

## 🔍 Troubleshooting

### **"Erro ao enviar e-mail"**
- Verifique se `RESEND_API_KEY` está correto no Netlify
- Verifique se `ADMIN_EMAIL` está configurado
- Veja logs no Netlify: **Deploys → Build logs**

### **Email não chega**
- Verifique spam/lixo eletrônico
- Confirme que Resend está ativo (não suspendido)
- Tente usar um email diferente (Gmail pode bloquear)

### **"Function not found"**
- Confirme que `netlify/functions/send-email.js` existe
- Refaça o deploy: `git push origin main`
- Aguarde 2-3 minutos após push

---

## 📊 O que Cada Email Contém

### **Email para o Respondente:**
- ✓ Saudação personalizada
- ✓ Seu estilo dominante (E1-E4)
- ✓ Pontuação em cada estilo
- ✓ Instruções para baixar PDF completo

### **Email para Você (Admin):**
- ✓ Nome do respondente
- ✓ Email dele
- ✓ Cargo/Posição
- ✓ Estilo dominante
- ✓ Gráfico com pontuações E1-E4

---

## 💡 Próximas Melhorias (Opcional)

Depois você pode adicionar:

1. **Dashboard de Admin** (Google Sheets API)
   - Consolidar respostas em uma planilha
   - Ver histórico de respostas

2. **PDF Automático** (Puppeteer)
   - Enviar PDF junto no email
   - Melhor formatação

3. **Integração com CRM**
   - Adicionar respondente automaticamente
   - Sincronizar com contatos

---

## 🎯 Limites Gratuitos

- **Resend:** 100 emails/dia (grátis)
- **Netlify:** 125.000 function calls/mês (grátis)
- Mais que suficiente para suas necessidades!

---

## ❓ Dúvidas?

Se algo não funcionar:
1. Verifique os logs no Netlify
2. Teste a função manualmente (curl/Postman)
3. Confirme variáveis de ambiente

---

**Pronto! 🚀 Seu diagnóstico está automatizado e respondentes recebem emails!**
