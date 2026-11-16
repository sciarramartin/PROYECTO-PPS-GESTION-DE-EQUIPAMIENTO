@echo off
title Sistema de Gestion de Equipamiento CPVS - Modo Demo
echo ========================================================
echo   CLINICA PRIVADA VELEZ SARSFIELD - MODO DEMOSTRACION
echo ========================================================
echo.
echo [1/3] Iniciando Backend API (Node.js/Express en puerto 3001)...
start "Backend API CPVS (Puerto 3001)" cmd /k "cd backend && npm run dev"

echo [2/3] Esperando inicializacion de la API...
timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Frontend Web (Vite/React en puerto 5173)...
start "Frontend Web CPVS (Puerto 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul
echo Abriendo aplicacion en tu navegador predeterminado...
start http://localhost:5173

echo.
echo ========================================================
echo   DEMO EN EJECUCION EXITOSA
echo   Web: http://localhost:5173
echo   API: http://localhost:3001/health
echo ========================================================
echo Para finalizar la demo, simplemente cierra las dos ventanas de consola abiertas.
pause
