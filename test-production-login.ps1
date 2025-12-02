#!/usr/bin/env pwsh
# Script de teste para verificar login em produção

param(
    [string]$Url = "https://site-corrida-backend.onrender.com",
    [string]$Usuario = "admin",
    [string]$Senha = "HVK1080hvk@@"
)

Write-Host "Testando Login em Producao" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: $Url" -ForegroundColor Yellow
Write-Host "Usuario: $Usuario" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Testando endpoint /login..." -ForegroundColor Blue
    
    $bodyJson = @{
        usuario = $Usuario
        senha = $Senha
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$Url/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $bodyJson `
        -ErrorAction Stop

    Write-Host ""
    Write-Host "LOGIN BEM-SUCEDIDO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Token recebido:" -ForegroundColor Green
    Write-Host $response.token -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Dados do Admin:" -ForegroundColor Green
    Write-Host "  ID: $($response.id)"
    Write-Host "  Usuario: $($response.usuario)"
    Write-Host "  Email: $($response.email)"
    Write-Host ""
    Write-Host "Producao esta funcionando!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERRO NA CONEXAO" -ForegroundColor Red
    Write-Host ""
    
    $errorMsg = $_.Exception.Message
    if ($errorMsg -like "*Connection*" -or $errorMsg -like "*Unable*") {
        Write-Host "Possíveis causas:" -ForegroundColor Yellow
        Write-Host "1. Render ainda esta fazendo deploy (aguarde 2-3 minutos)"
        Write-Host "2. URL incorreta"
        Write-Host "3. Variáveis de ambiente não foram carregadas"
    } elseif ($errorMsg -like "*401*") {
        Write-Host "Credenciais inválidas" -ForegroundColor Red
        Write-Host "Verifique usuario e senha" -ForegroundColor Yellow
    } else {
        Write-Host "Erro: $errorMsg" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Aguarde 2-3 minutos para o Render terminar o deploy"
    Write-Host "2. Verifique https://dashboard.render.com para status"
    Write-Host "3. Confira se as variáveis de ambiente estão setadas"
    Write-Host "4. Veja logs: Render Dashboard -> Logs"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

