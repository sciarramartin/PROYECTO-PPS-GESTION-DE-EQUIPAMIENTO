# Sistema de Gestión, Trazabilidad y Bioseguridad de Equipamiento Biomédico
### Clínica Privada Vélez Sarsfield (Servicios Médicos S.R.L.)
**Práctica Profesional Supervisada (PPS) – Ingeniería en Sistemas de Información – UTN FRC**  
**Estudiante:** Martín Sciarra (Legajo: 69650 | DNI: 40.107.751)  
**Supervisor Profesional:** Lic. Pablo Luis Bassi (Dpto. de Sistemas)  
**Supervisor Docente:** Ing. Mariel Ferrando (Dpto. ISI)  
**Período Oficial de Ejecución:** 16 de Noviembre de 2026 al 18 de Enero de 2027 (200 Horas Reloj)  

---

## 📌 Estado de Avance del Proyecto (MVP 1: 100% Completado – 28 Story Points)

Conforme a la metodología ágil del proyecto (Fase 1: Núcleo Operativo y Trazabilidad Base), se implementó un **vertical slice completo y desacoplado (Base de Datos + API REST + Frontend Web & Mobile Responsive)** bajo una arquitectura altamente cohesiva y de bajo acoplamiento, diseñada cumpliendo rigurosamente las **10 Heurísticas de Usabilidad de Jakob Nielsen**:

* **US-01: Visualización del Tablero Central de Disponibilidad (5 SP)**  
  *Tablero interactivo y reactivo con conteo en tiempo real de equipamiento biomédico, discriminando estados operativos (`DISPONIBLE`, `EN_USO`, `EN_MANTENIMIENTO`) y desglosando el stock dinámicamente por cada servicio clínico o área propietaria.*

* **US-02: Alta y Maestro de Equipos con Identificación Dual (5 SP)**  
  *Definición del modelo de datos para activos biomédicos serializados vinculado al catálogo maestro de artículos, implementando la estrategia de identificación dual: número de serie de fábrica unívoco, identificador visible de acceso rápido (sticker/código interno) y código QR para escaneo con cámara.*

* **US-03: Generación e Impresión de Etiquetas Duales Sticker + QR (3 SP)**  
  *Módulo generador de etiquetas físicas autoadhesivas con el imagotipo oficial de la Clínica Privada Vélez Sarsfield, número corto destacado de alta visibilidad, número de serie de fábrica y código QR de alta densidad generado dinámicamente con motor vectorial. Compatible con impresión térmica estándar (70x40mm, 50x30mm) y planchas A4 troqueladas mediante hoja de estilos `@media print`.*

* **US-04: Mapeo y Consulta de Ubicaciones Unificadas (3 SP)**  
  *Consolidación en un catálogo unificado de destinos físicos (servicios clínicos, depósitos y camas de internación general por piso) sin alterar ni romper las tablas legadas del sistema hospitalario.*

* **US-05: Registro de Préstamo Rápido en 3 Clics - Móvil y PC (5 SP)**  
  *Flujo ultra-simplificado de traslado de equipamiento con fricción operativa nula: 1) Detección/selección del equipo, 2) Selección de cama o servicio de destino, 3) Confirmación. Sin solicitud de datos clínicos de pacientes ni burocracia de contraseñas. Calcula automáticamente la ventana de rotación preventiva (48 hs) y respalda al usuario de guardia emisor.*

* **US-06: Localización Inmediata de Activos en Tiempo Real (2 SP)**  
  *Buscador reactivo con autocompletado instantáneo por identificador visual, número de serie o código QR, que informa en tiempo real la ubicación física actual, estado operativo y servicio propietario de cualquier equipo.*

* **US-07: Reingreso de Equipo con Tilde de Bioseguridad LT8 en 1 Clic (5 SP)**  
  *Protocolo sanitario de restitución de activo al servicio base propietario con certificación obligatoria del protocolo de sanitización con producto LT8 (Amonio Cuaternario de 5ta generación / 5 minutos de contacto). El botón de confirmación se encuentra blindado contra errores (Heurística 5 de Nielsen: Prevención de errores) hasta que el operador certifique el procedimiento.*

---

### 🎨 Cumplimiento de las 10 Heurísticas de Usabilidad de Nielsen
1. **Visibilidad del estado del sistema:** Notificaciones reactivas tipo Toast en tiempo real y badges semánticos con actualización inmediata sin recargar página.
2. **Coincidencia entre el sistema y el mundo real:** Vocabulario hospitalario nativo (Cama, Habitación, Servicio Propietario, Rotación 48hs, Producto LT8).
3. **Control y libertad del usuario:** Modales cerrables con botón cancelar, tecla `Escape` o clic fuera del área de diálogo.
4. **Consistencia y estándares:** Paleta cromática corporativa CPVS (Esmeralda = Libre, Azul = En Paciente, Ámbar = En Taller).
5. **Prevención de errores:** Bloqueo estricto del préstamo de equipos en taller; bloqueo del reingreso si no se certificó la bioseguridad LT8.
6. **Reconocimiento antes que recuerdo:** Previsualización visual de la ficha del equipo (marca, modelo, serial) en el modal antes de confirmar cualquier movimiento.
7. **Flexibilidad y eficiencia de uso:** Atajos táctiles en 3 clics en móviles y botones de acción rápida en cada fila del inventario de escritorio.
8. **Diseño estético y minimalista:** Interfaz despejada, tipografías legibles y sin campos innecesarios.
9. **Ayuda a reconocer, diagnosticar y recuperarse de errores:** Mensajes de validación claros y amigables.
10. **Ayuda y documentación:** Ayudas contextuales (tooltips informativos) en métricas y protocolos sanitarios.

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
