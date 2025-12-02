#!/usr/bin/env pwsh
# Script para verificar status de deploy em produção

Write-Host "Status de Implementacao em Producao" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Informacoes de Deploy:" -ForegroundColor Yellow
Write-Host "- Backend URL: https://site-corrida-backend.onrender.com" -ForegroundColor White
Write-Host "- Frontend URL: https://site-corrida.vercel.app" -ForegroundColor White
Write-Host ""

Write-Host "O que foi atualizado:" -ForegroundColor Green
Write-Host "✓ Database URL apontando para PostgreSQL RDS" -ForegroundColor White
Write-Host "✓ JWT_SECRET configurado" -ForegroundColor White
Write-Host "✓ Admin padrão: admin / HVK1080hvk@@" -ForegroundColor White
Write-Host "✓ Render configuration atualizado" -ForegroundColor White
Write-Host ""

Write-Host "Proximo passo: Verificar Dashboard do Render" -ForegroundColor Cyan
Write-Host "1. Abra: https://dashboard.render.com" -ForegroundColor Yellow
Write-Host "2. Procure por 'site-corrida-backend'" -ForegroundColor Yellow
Write-Host "3. Verifique:" -ForegroundColor Yellow
Write-Host "   - Status do deploy (deve estar verde)" -ForegroundColor Yellow
Write-Host "   - Logs (para erros de conexão)" -ForegroundColor Yellow
Write-Host "   - Environment Variables (DATABASE_URL, JWT_SECRET)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Dicas:" -ForegroundColor Magenta
Write-Host "- Deploy pode levar 2-3 minutos" -ForegroundColor White
Write-Host "- Verifique logs se tiver erro" -ForegroundColor White
Write-Host "- Certifique-se que DATABASE_URL está em Environment Variables" -ForegroundColor White
Write-Host "- Se nao conseguir logar, rode: node check-admins.js (em desenvolvimento)" -ForegroundColor White
Write-Host ""

Write-Host "Testar novamente:" -ForegroundColor Green
Write-Host "Espere 2-3 minutos e execute novamente:" -ForegroundColor White
Write-Host "  powershell -ExecutionPolicy Bypass -File test-production-login.ps1" -ForegroundColor Yellow
Write-Host ""
