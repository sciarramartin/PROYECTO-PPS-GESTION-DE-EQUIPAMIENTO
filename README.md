# Sistema de Gestión, Trazabilidad y Bioseguridad de Equipamiento Biomédico
### Clínica Privada Vélez Sarsfield (Servicios Médicos S.R.L.)
**Práctica Profesional Supervisada (PPS) – Ingeniería en Sistemas de Información – UTN FRC**  
**Estudiante:** Martín Sciarra (Legajo: 69650 | DNI: 40.107.751)  
**Supervisor Profesional:** Lic. Pablo Luis Bassi (Dpto. de Sistemas)  
**Supervisor Docente:** Ing. Mariel Ferrando (Dpto. ISI)  
**Período Oficial de Ejecución:** 16 de Noviembre de 2026 al 18 de Enero de 2027 (200 Horas Reloj)  

---

## 📌 Trabajo Realizado en el Día de Hoy (Día 1 Oficial - 16/11/2026)

Conforme a la metodología ágil del proyecto (MVP 1: Núcleo Operativo y Trazabilidad Base), en la jornada de hoy se implementó un **vertical slice completo (Base de Datos + API REST + Frontend Web Responsive)** que define la estructura relacional y operativa del sistema, extensible y extrapolable a cualquier categoría de equipamiento biomédico o activo hospitalario:

* **US-01: Visualización del Tablero Central de Disponibilidad**  
  *Tablero interactivo y reactivo con conteo en tiempo real de equipamiento biomédico, discriminando estados operativos (`DISPONIBLE`, `EN_USO`, `EN_MANTENIMIENTO`) y desglosando el stock dinámicamente por cada servicio clínico o área propietaria.*

* **US-02: Alta y Maestro de Equipos con Identificación Dual**  
  *Definición del modelo de datos para activos biomédicos serializados vinculado al catálogo maestro de artículos, implementando la estrategia de identificación dual: número de serie de fábrica unívoco, identificador visible de acceso rápido (sticker/código interno) y código QR para escaneo con cámara.*

* **US-04: Mapeo y Consulta de Ubicaciones Unificadas**  
  *Consolidación en un catálogo unificado de destinos físicos (servicios clínicos, depósitos y camas de internación general por piso) sin alterar ni romper las tablas legadas del sistema hospitalario.*

* **US-06: Localización Inmediata de Activos en Tiempo Real**  
  *Buscador reactivo con autocompletado instantáneo por identificador visual, número de serie o código QR, que informa en tiempo real la ubicación física actual, estado operativo y servicio propietario de cualquier equipo.*

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
* Node.js v18+ (recomendado v22+ o v24+)
* Git

### ▶️ Ejecución Rápida para Demostración (1 Clic en Windows)
Si estás en Windows y querés iniciar la demo de forma automática sin lidiar con comandos ni paradas técnicas:
1. Hacé doble clic en el archivo **`iniciar_demo.bat`** (o ejecutá `./iniciar_demo.ps1` en PowerShell).
2. El script iniciará automáticamente el backend, el frontend y abrirá tu navegador predeterminado en `http://localhost:5173`.

---

### 🛠️ Ejecución Manual Paso a Paso

#### 1. Clonar el repositorio y cambiar a la rama `develop`
```bash
git clone https://github.com/sciarramartin/PROYECTO-PPS-GESTION-DE-EQUIPAMIENTO.git
cd PROYECTO-PPS-GESTION-DE-EQUIPAMIENTO
git checkout develop
```

#### 2. Ejecutar el Backend
```bash
cd backend
npm install
npm run dev
```
*El servidor iniciará en: `http://localhost:3001` (Health Check: `http://localhost:3001/health`)*

#### 3. Ejecutar el Frontend
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
*La aplicación web estará disponible en: `http://localhost:5173`*

---

## 📋 Estructura de Ramas del Repositorio
* **`main`:** Rama principal de versiones consolidadas.
* **`develop`:** Rama activa de desarrollo y entregas de la PPS (rama actual de trabajo).
