# Script de teste completo para todos os endpoints
# Execute este script após o Render fazer o redeploy

$API_URL = "https://projeto-entre-amigas.onrender.com"
$LOCAL_API = "http://localhost:3001"

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Method = "Get",
        [object]$Body = $null,
        [string]$Description
    )
    
    Write-Host "`n=== Testando: $Description ===" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 30
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            Write-Host "Body: $jsonBody" -ForegroundColor Gray
            $params.Body = $jsonBody
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
        
        if ($response.Content) {
            $content = $response.Content | ConvertFrom-Json
            Write-Host "Resposta: $($content | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        }
        return $true
    } catch {
        Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
            try {
                $errorContent = $_.Exception.Response.GetResponseStream() | { param($s) New-Object System.IO.StreamReader($s) | ForEach-Object { $_.ReadToEnd() } }
                Write-Host "Erro Response: $errorContent" -ForegroundColor Red
            } catch { }
        }
        return $false
    }
}

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   TESTE COMPLETO DE ENDPOINTS         ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta

# Teste 1: GET /admin (deve listar inscrições)
Test-Endpoint -Url "$API_URL/admin" -Method Get -Description "GET /admin - Listar inscrições"

# Teste 2: POST /inscricao (criar nova inscrição)
$inscricao = @{
    nome = "Teste Integração $(Get-Date -Format 'HHmmss')"
    telefone = "11999999999"
    email = "teste-$(Get-Random)@example.com"
    autorizado = $true
}
Test-Endpoint -Url "$API_URL/inscricao" -Method Post -Body $inscricao -Description "POST /inscricao - Criar inscrição"

# Teste 3: POST /login (autenticar admin)
$login = @{
    usuario = "admin"
    senha = "HVK1080hvk@@"
}
Test-Endpoint -Url "$API_URL/login" -Method Post -Body $login -Description "POST /login - Autenticar"

# Teste 4: GET /relatorio/excel (baixar relatório em Excel)
Write-Host "`n=== Testando: GET /relatorio/excel ===" -ForegroundColor Cyan
Write-Host "URL: $API_URL/relatorio/excel" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "$API_URL/relatorio/excel" -Method Get -TimeoutSec 30 -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
    Write-Host "✓ Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 5: GET /relatorio/pdf (baixar relatório em PDF)
Write-Host "`n=== Testando: GET /relatorio/pdf ===" -ForegroundColor Cyan
Write-Host "URL: $API_URL/relatorio/pdf" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "$API_URL/relatorio/pdf" -Method Get -TimeoutSec 30 -UseBasicParsing
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
    Write-Host "✓ Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   TESTES COMPLETOS                    ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta
