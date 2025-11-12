@echo off
REM Script para inicializar repositório Git do projeto Entre Amigas

echo ========================================
echo Entre Amigas - Inicializar Git
echo ========================================
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado. Baixe em https://git-scm.com
    pause
    exit /b 1
)

echo ✅ Git detectado
echo.

REM Perguntar URL do repositório
set /p GITHUB_URL="Digite a URL do seu repositório GitHub (exemplo: https://github.com/seu-usuario/projeto-entre-amigas.git): "

if "%GITHUB_URL%"=="" (
    echo ❌ URL do repositório não fornecida.
    pause
    exit /b 1
)

echo.
echo 📝 Inicializando repositório...
git init
git add .
git commit -m "Initial commit: Entre Amigas platform v1.0"
git branch -M main
git remote add origin %GITHUB_URL%

echo.
echo 🚀 Fazendo push para GitHub...
git push -u origin main

echo.
echo ✅ Repositório criado com sucesso!
echo.
echo 📋 Próximos passos:
echo 1. Acesse: %GITHUB_URL%
echo 2. Configure deploy na Vercel (frontend)
echo 3. Configure deploy no Render (backend)
echo 4. Veja DEPLOY.md para instruções detalhadas
echo.
pause
