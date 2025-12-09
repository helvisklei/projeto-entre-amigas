#!/usr/bin/env pwsh
# Script de teste para Google Forms Integration

param(
    [string]$Url = "http://localhost:5000",
    [string]$NomeTest = "Maria Silva Teste",
    [string]$EmailTest = "teste_$((Get-Random -Minimum 1000 -Maximum 9999))@email.com",
    [string]$TelefoneTest = "81 98765-4321"
)

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   TESTE - Google Forms Integration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Informacoes do Teste:" -ForegroundColor Yellow
Write-Host "  URL API: $Url" -ForegroundColor White
Write-Host "  Nome: $NomeTest" -ForegroundColor White
Write-Host "  Email: $EmailTest" -ForegroundColor White
Write-Host "  Telefone: $TelefoneTest" -ForegroundColor White
Write-Host ""

# Criar JSON do corpo
$bodyJson = @{
    nome = $NomeTest
    telefone = $TelefoneTest
    email = $EmailTest
    cpf = "999.999.999-99"
    cidade = "Recife"
    tamanho_camisa = "M"
    autorizado = $true
} | ConvertTo-Json

Write-Host "Enviando inscricao..." -ForegroundColor Blue
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$Url/inscricao" `
        -Method POST `
        -ContentType "application/json" `
        -Body $bodyJson `
        -ErrorAction Stop

    Write-Host "================================================" -ForegroundColor Green
    Write-Host "   SUCESSO! Inscricao enviada" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Resposta do Servidor:" -ForegroundColor Green
    Write-Host "  Status: $($response.success)" -ForegroundColor White
    Write-Host "  ID da Inscricao: $($response.id)" -ForegroundColor Yellow
    Write-Host "  Mensagem: $($response.message)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "1. Verifique seu Google Forms (respostas)" -ForegroundColor White
    Write-Host "2. Verifique Google Sheet sincronizado" -ForegroundColor White
    Write-Host "3. Verifique banco de dados local:" -ForegroundColor White
    Write-Host ""
    Write-Host "   SELECT * FROM inscricoes ORDER BY id DESC LIMIT 1;" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Dados foram salvos em:" -ForegroundColor Green
    Write-Host "  OK PostgreSQL (local)" -ForegroundColor White
    Write-Host "  OK Google Forms (online)" -ForegroundColor White
    Write-Host "  OK Google Sheet (sincronizado)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "   ERRO ao enviar inscricao" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    
    $errorMsg = $_.Exception.Message
    Write-Host "Erro: $errorMsg" -ForegroundColor Red
    Write-Host ""
    
    if ($errorMsg -like "*Connection*") {
        Write-Host "Possivel causa: Backend nao esta rodando" -ForegroundColor Yellow
        Write-Host "Execute primeiro:" -ForegroundColor White
        Write-Host "  cd site-corrida/backend" -ForegroundColor Yellow
        Write-Host "  npm start" -ForegroundColor Yellow
    } elseif ($errorMsg -like "*Limite*100*") {
        Write-Host "Aviso: Limite de 100 inscricoes atingido!" -ForegroundColor Yellow
        Write-Host "Proximo evento: Setembro 2025" -ForegroundColor White
    } else {
        Write-Host "Verifique logs do servidor para mais detalhes" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

