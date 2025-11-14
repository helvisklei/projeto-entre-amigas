# Script de teste simples para endpoints

$API_URL = "https://projeto-entre-amigas.onrender.com"

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  TESTE DE ENDPOINTS - RENDER         " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# Teste 1: GET /admin
Write-Host "`n[1/5] GET /admin - Listar inscricoes..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/admin" -Method Get -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Total de inscrições: $($data.Count)" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 2: POST /login
Write-Host "`n[2/5] POST /login - Autenticar admin..." -ForegroundColor Cyan
try {
    $login = @{ usuario="admin"; senha="HVK1080hvk@@" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$API_URL/login" -Method Post -Body $login -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Token gerado: $($data.token)" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 3: POST /inscricao
Write-Host "`n[3/5] POST /inscricao - Criar inscrição..." -ForegroundColor Cyan
try {
    $timestamp = Get-Random
    $inscricao = @{
        nome = "Teste $timestamp"
        telefone = "11999999999"
        email = "teste$timestamp@example.com"
        autorizado = $true
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$API_URL/inscricao" -Method Post -Body $inscricao -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Inscrição criada com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 4: GET /relatorio/excel
Write-Host "`n[4/5] GET /relatorio/excel - Download Excel..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/relatorio/excel" -Method Get -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 5: GET /relatorio/pdf
Write-Host "`n[5/5] GET /relatorio/pdf - Download PDF..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/relatorio/pdf" -Method Get -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "  TESTES CONCLUIDOS                   " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
