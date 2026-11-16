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

## 🏛️ Arquitectura del Sistema (Bajo Acoplamiento y Alta Cohesión)

El proyecto adopta una arquitectura en capas por responsabilidades (Arquitectura de 3 Capas / MVC):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                            │
│   Frontend Web Responsive (React + Vite + Tailwind CSS + Lucide)       │
│   • Mobile-First para uso táctil en guardias y smartphones             │
│   • Desktop para administración y auditoría de Alejandra               │
│   • Preparado para empaquetado móvil a APK mediante Capacitor          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (API REST)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       CAPA DE LÓGICA Y NEGOCIO                         │
│   Backend Modular (Node.js + Express + TypeScript)                     │
│   • Controllers: Manejo de peticiones y respuestas HTTP                │
│   • Services: Reglas de negocio, cálculos de stock y validaciones       │
│   • Repositories: Abstracción agnóstica de acceso a datos (Patrón Repo)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Query Adapter
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          CAPA DE PERSISTENCIA                          │
│   • Entorno Local Actual: SQLite (Zero-Install, archivo local)         │
│   • Entorno de Producción: Microsoft SQL Server (selfcontrol T-SQL)    │
│   • Scripts de migración y vistas no invasivas (vw_sincronizacion_camas)│
└────────────────────────────────────────────────────────────────────────┘
```

### 🔄 Transición de SQLite a Microsoft SQL Server (`selfcontrol`)
Para trabajar de forma ágil sin requerir la instalación pesada de SQL Server en la máquina de desarrollo, se implementó un adaptador con base de datos **SQLite local** (`database/clinica_biomedico.sqlite`) que reproduce exactamente las mismas tablas, tipos y restricciones que SQL Server.

Al momento del despliegue en la infraestructura de la clínica:
1. Se ejecutan los scripts ubicados en `/database`:
   - `01_schema_sqlserver.sql`: Crea las tablas y vistas en el motor SQL Server institucional.
   - `02_seed_sqlserver.sql`: Carga masiva de catálogos y equipos.
2. En el archivo `.env` del backend se configura:
   ```env
   DB_ENGINE=mssql
   DB_HOST=servidor_clinica
   DB_NAME=selfcontrol
   DB_USER=usuario
   DB_PASSWORD=clave
   ```
No se requiere modificar ninguna línea de código en la capa de servicios ni controladores.

---

## 🎨 Identidad Visual y Estética Oficial (CPVS)

El diseño del frontend replica con fidelidad milimétrica la identidad visual de la web oficial de la [Clínica Privada Vélez Sarsfield](https://www.cpvs.com.ar):

* **Azul Institucional Primario:** `#07599b`
* **Celeste / Cian de Acento:** `#00a0e0`
* **Fondo Clínico Suave:** `#f4f7ff`
* **Footer Corporativo Oscuro:** `#1a1c2e`
* **Tipografía Oficial:** `Titillium Web` / `Helvetica Neue`
* **Logo Oficial:** Incorporado desde los activos institucionales en alta definición.

---

## 📱 Soporte Dual: Web de Escritorio y APK Móvil

La aplicación está concebida para adaptarse al flujo de trabajo real de la institución:
* **Alejandra en la oficina:** Dispone de visualización tabular expandida con filtros avanzados y auditoría.
* **Alejandra o Supervisores de Guardia caminando en sala:** Interfaz táctil tipo tarjeta con botones de gran tamaño y buscador al alcance del pulgar.
* **Compilación a APK Android:** Se incluye `capacitor.config.ts`. Para generar el APK basta ejecutar:
  ```bash
  cd frontend
  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap add android
  npx cap build android
  ```

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
