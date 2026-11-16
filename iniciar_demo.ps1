Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   CLÍNICA PRIVADA VÉLEZ SARSFIELD - MODO DEMOSTRACIÓN   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/3] Iniciando Backend API (Node.js/Express en puerto 3001)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd backend && npm run dev"

Write-Host "[2/3] Esperando inicialización de la API..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "[3/3] Iniciando Frontend Web (Vite/React en puerto 5173)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd frontend && npm run dev"

Start-Sleep -Seconds 3
Write-Host "Abriendo aplicación en el navegador..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  DEMO EN EJECUCIÓN EXITOSA" -ForegroundColor Green
Write-Host "  Web: http://localhost:5173" -ForegroundColor Green
Write-Host "  API: http://localhost:3001/health" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Para finalizar la demo, simplemente cierra las dos ventanas de consola abiertas."
