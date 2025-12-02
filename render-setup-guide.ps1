#!/usr/bin/env pwsh
# Script para monitorar deploy do Render

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MONITOR DE DEPLOY - RENDER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  IMPORTANTE: Render pode estar SEM Environment Variables!" -ForegroundColor Yellow
Write-Host ""

Write-Host "Siga estes passos:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Acesse: https://dashboard.render.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Procure por 'site-corrida-backend'" -ForegroundColor White
Write-Host ""
Write-Host "3. Se não encontrar, crie novo:" -ForegroundColor White
Write-Host "   - Clique em 'New +'" -ForegroundColor White
Write-Host "   - Selecione 'Web Service'" -ForegroundColor White
Write-Host "   - Conecte: https://github.com/helvisklei/projeto-entre-amigas" -ForegroundColor White
Write-Host "   - Branch: main" -ForegroundColor White
Write-Host ""
Write-Host "4. Vá para 'Environment' e adicione:" -ForegroundColor White
Write-Host ""

$envVars = @(
    @{Key="DATABASE_URL"; Value="postgresql://inscricoes_entre_amigas_db_user:RYARX2HIBOidZD6MFUFoBiaaF09gWa1t@dpg-d4ac1hje5dus73a1cmig-a/inscricoes_entre_amigas_db"},
    @{Key="JWT_SECRET"; Value="sua-chave-secreta-super-segura-aqui-mude-em-producao"},
    @{Key="DEFAULT_ADMIN_USER"; Value="admin"},
    @{Key="DEFAULT_ADMIN_PASS"; Value="HVK1080hvk@@"},
    @{Key="PORT"; Value="5000"}
)

foreach ($var in $envVars) {
    Write-Host "   KEY: $($var.Key)" -ForegroundColor Yellow
    Write-Host "   VALUE: $($var.Value)" -ForegroundColor White
    Write-Host ""
}

Write-Host "5. Clique em 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "6. Aguarde 2-3 minutos..." -ForegroundColor White
Write-Host ""

Write-Host "Depois, execute:" -ForegroundColor Green
Write-Host "  powershell -ExecutionPolicy Bypass -File test-production-login.ps1" -ForegroundColor Yellow
Write-Host ""

Write-Host "Para mais detalhes, abra:" -ForegroundColor Cyan
Write-Host "  RENDER_SETUP_MANUAL.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
