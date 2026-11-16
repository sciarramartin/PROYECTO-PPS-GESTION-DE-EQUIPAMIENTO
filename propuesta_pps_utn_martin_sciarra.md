# UNIVERSIDAD TECNOLÓGICA NACIONAL
## Facultad Regional Córdoba
### Departamento de Ingeniería en Sistemas de Información

---

# PROPUESTA INICIAL DE PROYECTO
## Práctica Profesional Supervisada (PPS) – Ordenanzas CSU Nº 973 / 1022

* **Institución Académica:** Universidad Tecnológica Nacional – Facultad Regional Córdoba (UTN-FRC)
* **Carrera / Departamento:** Departamento de Ingeniería en Sistemas de Información
* **Identificación del Trámite:** Práctica Profesional Supervisada (PPS)
* **Estudiante:** Sciarra, Martín
* **Legajo Nº:** 69650 | **D.N.I. Nº:** 40.107.751
* **Organización / Empresa de Acogida:** Servicios Médicos S.R.L. (Clínica Privada Vélez Sarsfield)
* **Denominación / Título del Proyecto:** Aplicación móvil para la gestión logística de la reparación y trazabilidad de equipos médicos
* **Supervisor Profesional:** Lic. Pablo Luis Bassi (Dpto. de Sistemas de Información – Mat. Prof. Nº 02089)
* **Supervisor Docente Tutor:** Ing. Mariel Ferrando (Docente Dpto. de Ingeniería en Sistemas de Información)
* **Año Lectivo:** 2026
* **Período de Ejecución:** 19/10/2026 al 19/12/2026
* **Cantidad de Horas a Realizar:** 200 Horas reloj (40 jornadas laborables de 5 horas diarias)

---

## Índice

1. [Observaciones de Fechas y Horas de la PPS](#1-observaciones-de-fechas-y-horas-de-la-pps)
2. [Objetivo del Proyecto](#2-objetivo-del-proyecto)
3. [Objetivos de la Práctica Profesional Supervisada](#3-objetivos-de-la-práctica-profesional-supervisada)
4. [Breve Descripción del Alcance del Proyecto](#4-breve-descripción-del-alcance-del-proyecto)
5. [Breve Descripción del Alcance de la PPS](#5-breve-descripción-del-alcance-de-la-pps)
6. [Rol del Estudiante](#6-rol-del-estudiante)
7. [Herramientas que se van a utilizar](#7-herramientas-que-se-van-a-utilizar)
8. [Metodología de Trabajo](#8-metodología-de-trabajo)
9. [Equipo de Trabajo y Autoridades Académicas](#9-equipo-de-trabajo-y-autoridades-académicas)
10. [Actividades Reservadas Relacionadas](#10-actividades-reservadas-relacionadas)
11. [Plan de Trabajo Detallado (Cronograma de 200 Horas)](#11-plan-de-trabajo-detallado-cronograma-de-200-horas)

---

## 1. Observaciones de Fechas y Horas de la PPS

Conforme a las pautas establecidas en el instructivo de presentación de la PPS y en concordancia con los datos declarados en la Solicitud Inicial de PPS y el Convenio Específico, se fundamenta el cálculo de días y horas de la práctica:

* **Fecha de Inicio:** 19/10/2026
* **Fecha de Finalización:** 19/12/2026
* **Días de Asistencia:** Lunes a Viernes
* **Horario de la Práctica:** 08:00 a 13:00 hs (5 horas diarias continuas)
* **Total de Días de Semana en el Período:** 45 días hábiles teóricos de calendario.
* **Días No Laborables / Feriados Oficiales Informados (5 días):**
  * *06/11/2026:* Día del Empleado de Sanidad (Jornada no laborable institucional en el sector de salud).
  * *20/11/2026:* Feriado Nacional – Día de la Soberanía Nacional.
  * *23/11/2026:* Feriado Nacional con Fines Turísticos (traslado / puente).
  * *07/12/2026:* Feriado Nacional Puente Turístico.
  * *08/12/2026:* Feriado Nacional – Inmaculada Concepción de María.
* **Total de Días Hábiles Efectivos de PPS:** **40 días**.
* **Cálculo de Carga Horaria Total:**  
  $$\text{Total Horas} = 40 \text{ días hábiles} \times 5 \text{ horas/día} = \mathbf{200 \text{ horas reloj}}$$

---

## 2. Objetivo del Proyecto

Dentro de la entidad **Servicios Médicos S.R.L. (Clínica Privada Vélez Sarsfield)**, se desarrollará e implementará un sistema de software integral para la **gestión logística, control de stock, trazabilidad y bioseguridad del equipamiento biomédico crítico** (respiradores volumétricos, bombas de infusión continua, monitores multiparamétricos, electrocardiógrafos y cardiodesfibriladores).

El proyecto resuelve la dispersión de activos de alta demanda médica entre los 22 servicios clínicos y sedes asistenciales de la institución (focalizándose en el cuello de botella crítico de 42 bombas de infusión distribuidas en 176 camas de internación general), audita la custodia en los libros descentralizados de guardia y servicio técnico, registra el cumplimiento estricto del protocolo de desinfección hospitalaria con producto biocida LT8, y garantiza el cumplimiento riguroso de las exigencias documentales requeridas por la Dirección General de Regulación Sanitaria del Ministerio de Salud de la Provincia de Córdoba.

---

## 3. Objetivos de la Práctica Profesional Supervisada

Dentro de la institución de acogida se desarrollará el proyecto con los siguientes objetivos profesionales:

* **Diseñar e implementar una Aplicación Web Responsive:** Construir un sistema accesible tanto desde terminales de escritorio (PC) como desde el dispositivo móvil corporativo de la Supervisión General (24/7), enfocado en la regla de los 3 clics y respuesta en menos de 10 segundos para garantizar máxima agilidad clínica sin fricción burocrática.
* **Modelar y estructurar la Base de Datos Relacional (Microsoft SQL Server):** Integrar la estructura legada preexistente (`sucursales`, `depositos`, `habitaciones`, `Sector`) mediante una entidad unificadora de `ubicaciones` y tablas normalizadas para activos serializados (`equipos_biomedicos`), historial inmutable de custodias (`movimientos_equipos`) y órdenes de reparación (`mantenimientos_equipos`).
* **Sistematizar la Bioseguridad y Desinfección Hospitalaria (Protocolo LT8):** Incorporar un mecanismo de confirmación ágil mediante *Checkbox de Bioseguridad al Reingreso* (`desinfeccion_realizada = 1`), que permita la transición directa de `EN_USO` a `DISPONIBLE` con registro de auditoría silenciosa en el retorno sin generar demoras burocráticas en guardias críticas.
* **Blindar el Circuito de Mantenimiento Técnico (Control Anti-Intercambio):** Digitalizar el seguimiento de reparaciones vinculando los números de remito oficiales en papel y los libros descentralizados de guardia (UTI, Materno-Infantil, Trasplante), exigiendo validación obligatoria por número de serie físico al retorno para erradicar canjes involuntarios de aparatos.
* **Informar periódicamente sobre el avance de la tarea:** Emitir reportes de estado y demostraciones incrementales quincenales según la documentación y estándares establecidos por la UTN FRC y los supervisores asignados.

---

## 4. Breve Descripción del Alcance del Proyecto

El proyecto global abarca la transformación digital de la trazabilidad biomédica en las sedes asistenciales de la Clínica Privada Vélez Sarsfield (Sede Central Naciones Unidas, Sede Norte y Sede Ruta 20).

Cubre el ciclo de vida completo de cada equipo médico:
1. Alta patrimonial y clasificación de criticidad técnica.
2. Asignación a servicios propietarios (UTI Adultos, UTIP, Neonatología, Quirófanos, Guardia Central, Oncología, Hemodinamia).
3. Préstamos transitorios y traslados a camas de internación general (Pisos 1, 2 y 3).
4. Retorno con cumplimiento auditado del protocolo de desinfección física con producto biocida LT8 (tiempo de contacto 5 minutos).
5. Salidas a mantenimiento preventivo/correctivo (interno en taller de bioingeniería o derivado a service oficial externo) con seguimiento estricto de remitos.
6. Bajas patrimoniales y generación de informes de cumplimiento ministerial para inspecciones sanitarias.

---

## 5. Breve Descripción del Alcance de la PPS

El alcance específico de la práctica supervisada a desarrollar por el estudiante comprende:
* **Relevamiento y Modelado Funcional:** Diagnóstico operativo in situ, entrevistas con actores clave (Responsable de Equipamiento, Supervisores de Área y Supervisión General 24/7) y formalización de reglas de negocio anti-burocracia.
* **Diseño y Normalización de Base de Datos:** Formulación de scripts Transact-SQL integrados con el motor SQL Server preexistente, garantizando integridad referencial, índices de optimización y registros de auditoría.
* **Desarrollo del Backend / API REST:** Implementación de endpoints de autenticación, gestión de inventario, movimientos de custodias, registro de remitos y transacciones de retorno.
* **Desarrollo del Frontend Web Responsive:** Creación de un panel de control interactivo (tablero con semáforo de disponibilidad, panel de retención de bombas +48 hs, modales de préstamo en 3 clics y módulo de taller).
* **Módulo de Identificación y Generación de QR:** Algoritmo de renderizado e impresión de etiquetas con numeración visible (1 a 32 para bombas Lexx) y códigos QR para escaneo ágil desde la cámara web o móvil.
* **Validación de Usabilidad y Pruebas Piloto:** Pruebas funcionales de campo durante guardias reales y talleres de capacitación con usuarios finales.
* **Memoria Técnica y Documentación:** Redacción de manuales operativos para usuarios y administradores, especificación técnica de la solución y reporte final de PPS para UTN FRC.

---

## 6. Rol del Estudiante

El estudiante se desempeña en el rol de **Pasante / Desarrollador FullStack y Analista de Sistemas**, siendo responsable del ciclo de desarrollo de software de punta a punta: relevamiento de requerimientos, diseño conceptual y físico de bases de datos, desarrollo frontend/backend, control de calidad, puesta en marcha del piloto y confección de la documentación técnica institucional.

---

## 7. Herramientas que se van a utilizar

* **Microsoft SQL Server (Transact-SQL):** Se utilizará para el diseño conceptual, relacional y físico de la base de datos, estructurando tablas normalizadas, procedimientos almacenados, vistas de integración con tablas legadas de internación (`habitaciones`, `Sector`) y asegurando la integridad referencial y transaccional de los movimientos de equipos.
* **Node.js con Express y TypeScript (o .NET Web API):** Se utilizará para la construcción de la API REST del backend, desarrollando los controladores, servicios de lógica de negocio, validaciones de seguridad, endpoints de autenticación y lógica de préstamos, reingresos y derivaciones a taller.
* **React.js con Vite y Tailwind CSS:** Se utilizará para el desarrollo de la interfaz de usuario Web Responsive (adaptable a PC de escritorio y teléfonos móviles corporativos), implementando los tableros de control con semáforos de stock, alertas de retención y modales de préstamo rápido en 3 clics.
* **Librerías de Códigos QR (HTML5-QRCode y QRCodegen):** Se utilizarán para la generación dinámica e impresión estandarizada de etiquetas QR de alta densidad y la captura en tiempo real mediante la cámara del navegador web o móvil.
* **Git y GitHub:** Se utilizarán como sistema de control de versiones y repositorio remoto para la administración del código fuente, branching, versionado de incrementos funcionales y respaldo del software.
* **Visual Studio Code:** Se utilizará como Entorno de Desarrollo Integrado (IDE) principal para la programación de los componentes del frontend y módulos del backend.
* **Mermaid y Visual Paradigm:** Se utilizarán para la confección formal de diagramas entidad-relación (DER), diagramas de arquitectura de software y diagramas de flujo de procesos hospitalarios.

---

## 8. Metodología de Trabajo

Se utilizará una metodología ágil iterativa e incremental (adaptada de **Scrum / Kanban**), dividida en iteraciones semanales con entregas tempranas de incrementos de software funcionales:
* **Entregas tempranas (MVPs):** Validación rápida con usuarios reales para evitar desfasajes con la práctica clínica.
* **Diseño centrado en el usuario:** Enfoque en la eliminación de fricción burocrática en contextos de urgencia médica.
* **Reuniones de sincronización:** Revisiones periódicas con la referente funcional (Alejandra) y el supervisor profesional de la entidad (Lic. Pablo Bassi).

---

## 9. Equipo de Trabajo y Autoridades Académicas

### Autoridades Académicas (UTN - Facultad Regional Córdoba)
* **Director de Departamento de Ingeniería en Sistemas de Información:** Ing. Sergio Quinteros.
* **Coordinador de Práctica Profesional Supervisada:** Ing. Federico Raúl Olivo Aneiros.
* **Supervisor Docente Tutor:** Ing. Mariel Ferrando (D.N.I. Nº 17.114.677 - Docente Dpto. ISI).

### Equipo Institucional (Servicios Médicos S.R.L. / Clínica Privada Vélez Sarsfield)
* **Supervisor Profesional (Tutor en la Entidad):** Lic. Pablo Luis Bassi (D.N.I. Nº 23.197.046 – Mat. Prof. Nº 02089 – Dpto. de Sistemas de Información).
* **Representante Legal / Gerente de la Entidad:** Lic. Darío N. Jaimovich (D.N.I. Nº 29.062.780).
* **Referente Funcional / Usuaria Clave (Stakeholder):** Alejandra (Responsable General de Equipamiento Biomédico).
* **Supervisores de Guardia y Área:** Supervisión General (24/7) y Supervisores de Áreas Cerradas (Lunes a Viernes).

### Estudiante Practicante
* **Martín Sciarra** (Legajo Nº 69650 – D.N.I. Nº 40.107.751 – Alumno Regular ISI).

---

## 10. Actividades Reservadas Relacionadas

En estricto cumplimiento con el instructivo institucional de PPS, se transcriben textualmente y sin modificaciones las Actividades Reservadas del título de Ingeniero en Sistemas de Información que guardan vinculación directa con las tareas a desarrollar:

* **AR1:** Especificar, proyectar y desarrollar sistemas de información, sistemas de comunicación de datos y software cuya utilización pueda afectar la seguridad, salud, bienes o derechos.
* **AR5:** Dirigir y controlar la implementación, operación y mantenimiento de lo anteriormente mencionado.

---

## 11. Plan de Trabajo Detallado (Cronograma de 200 Horas)

* **Período de Ejecución:** **19 de Octubre de 2026 al 19 de Diciembre de 2026**
* **Carga Horaria:** **40 jornadas laborales continuas de exactamente 5 horas diarias (08:00 a 13:00 hs)**, totalizando **200 horas reloj**.

| Nº | Fecha | Nombre de la Tarea | Descripción Detallada de la Actividad Realizada | Horas |
| :-: | :---: | :--- | :--- | :-: |
| 1 | **19/10/2026** | Inducción institucional y relevamiento inicial | Presentación en sede central, acuerdos de confidencialidad, reconocimiento de servicios clínicos críticos (UTI, UTIP, Neo, Quirófano) y relevamiento de infraestructura tecnológica disponible. | 5 |
| 2 | **20/10/2026** | Relevamiento del parque biomédico crítico | Entrevista técnica con Alejandra; censo de respiradores volumétricos, cardiodesfibriladores y monitores multiparamétricos en los 22 servicios y registro de sus números de serie de fábrica. | 5 |
| 3 | **21/10/2026** | Análisis de cuello de botella de bombas de infusión | Diagnóstico del flujo de 42 bombas de infusión continua frente a 176 camas de internación general; análisis de rotación de bombas LEXX (stickers 1 al 32) y bombas secundarias. | 5 |
| 4 | **22/10/2026** | Relevamiento del protocolo de bioseguridad LT8 | Análisis in situ del proceso de desinfección con producto biocida LT8 (tiempo de contacto 5 minutos); estudio de los libros físicos descentralizados de Entrega y Recibo en enfermería de guardia. | 5 |
| 5 | **23/10/2026** | Consolidación de especificación de requerimientos | Redacción del informe consolidado de relevamiento funcional, matriz de trazabilidad de actores (Alejandra, Supervisión General 24/7) y definición de reglas de negocio para la regla de los 3 clics. | 5 |
| 6 | **26/10/2026** | Análisis de base de datos legada hospitalaria | Inspección técnica del script institucional `scriptstock.sql` del motor SQL Server (`[selfcontrol]`), examinando tablas de `sucursales`, `depositos`, `articulos` y cuentas de usuarios. | 5 |
| 7 | **27/10/2026** | Análisis del modelo de internación y habitaciones | Diagnóstico de `scripthabitaciones.sql`; análisis de la clave compuesta tripartita `(nro_habitacion, cama, sector)` y diseño de la estrategia de vinculación no invasiva mediante vistas SQL Server. | 5 |
| 8 | **28/10/2026** | Diseño conceptual del modelo DER extendido | Modelado relacional de nuevas entidades: `equipos_biomedicos`, `movimientos_equipos`, `mantenimientos_equipos`, `ubicaciones` unificadas y tablas de auditoría inmutable de desinfección. | 5 |
| 9 | **29/10/2026** | Formulación de scripts DDL Transact-SQL | Escritura de scripts de creación de esquemas, tablas, restricciones de clave foránea, índices clúster y no clúster, triggers de auditoría y campos booleanos de bioseguridad en SQL Server. | 5 |
| 10 | **30/10/2026** | Validación del modelo de datos con Sistemas | Sesión técnica de revisión de scripts Transact-SQL y esquema relacional junto al supervisor profesional Lic. Pablo Bassi, validando consistencia y tiempos de respuesta esperados. | 5 |
| 11 | **02/11/2026** | Setup del entorno de desarrollo y repositorio | Configuración del repositorio Git en GitHub, creación de ramas de trabajo, inicialización del motor SQL Server de desarrollo y configuración de variables de entorno y conexión. | 5 |
| 12 | **03/11/2026** | Arquitectura y scaffolding de la API REST | Estructuración del backend en arquitectura por capas (Controladores, Servicios de Dominio, Acceso a Datos / Repositorios) y configuración de middlewares de logging y manejo global de errores. | 5 |
| 13 | **04/11/2026** | Desarrollo de servicios de catálogo y ubicaciones | Programación de endpoints REST para la consulta unificada de depósitos de servicios clínicos y habitaciones de internación general por sucursal, filtrando camas activas (`baja IS NULL`). | 5 |
| 14 | **05/11/2026** | Desarrollo de servicios de inventario de equipos | Implementación de endpoints de consulta, filtrado por criticidad, búsqueda por número visible de sticker (1 a 32), número de serie oficial y asociación de estados operativos. | 5 |
| 15 | **09/11/2026** | Setup del Frontend Web Responsive | Inicialización del proyecto de interfaz con React.js, Vite y Tailwind CSS; configuración del sistema de enrutamiento SPA y estructura de componentes accesibles para móviles táctiles y escritorio. | 5 |
| 16 | **10/11/2026** | Desarrollo de UI: Tablero de Control de Stock | Maquetación interactiva del dashboard principal con contadores en tiempo real del parque de bombas y respiradores discriminados por estado: Disponibles, En Uso y En Mantenimiento. | 5 |
| 17 | **11/11/2026** | Desarrollo de componente de alerta de retención | Implementación del panel de monitoreo visual con alertas automáticas para equipos retenidos por más de 48 horas en habitaciones de piso, habilitando el botón de reclamo directo. | 5 |
| 18 | **12/11/2026** | Integración del Dashboard con servicios REST | Conexión de componentes de React con la API del backend mediante Axios; manejo de estados asíncronos, loaders de espera, reintentos y persistencia reactiva en el tablero general. | 5 |
| 19 | **13/11/2026** | Módulo de generación e impresión de códigos QR | Desarrollo de la funcionalidad de renderizado dinámico de etiquetas QR y diseño de plantilla de impresión física estandarizada con número visible y código de barras bidimensional. | 5 |
| 20 | **16/11/2026** | Lógica transaccional de préstamos y traslados | Desarrollo de endpoints transaccionales para registrar transferencias inter-servicio, asignación transitoria a cama física de internación y actualización atómica del estado del activo. | 5 |
| 21 | **17/11/2026** | Desarrollo de UI de Préstamo Rápido en 3 Clics | Maquetación del diálogo de traslado ultrarrápido: selector de sticker/QR, selector de destino asistencial y confirmación en menos de 8 segundos sin requerir carga de datos de pacientes. | 5 |
| 22 | **18/11/2026** | Lógica de reingreso y bioseguridad LT8 | Implementación del flujo transaccional de retorno de equipos: validación obligatoria del tilde de desinfección biocida LT8 y transición instantánea del equipo al estado DISPONIBLE. | 5 |
| 23 | **19/11/2026** | Auditoría y control de bioseguridad al retorno | Programación del registro silencioso de trazabilidad: captura automática de usuario receptor, marca temporal exacta (timestamp) y confirmación de protocolo de desinfección hospitalaria. | 5 |
| 24 | **24/11/2026** | Demostración funcional de MVP 1 a usuarios clave | Presentación del primer incremento operativo del tablero de stock y préstamos rápidos ante Alejandra; recolección de métricas de tiempo de uso y retroalimentación de interfaz. | 5 |
| 25 | **25/11/2026** | Módulo de derivación a servicio técnico y taller | Desarrollo de endpoints para registrar salidas de equipos con fallas mecánicas/eléctricas, motivo de avería técnica y persistencia del número de remito oficial en papel. | 5 |
| 26 | **26/11/2026** | Lógica anti-fuga: Validación por número de serie | Implementación de regla de validación estricta al reingreso desde taller: comparación automática entre el serial de fábrica devuelto y el serial remitido para impedir cambios involuntarios. | 5 |
| 27 | **27/11/2026** | UI: Panel de seguimiento de taller y semáforo | Desarrollo de la vista web de control de mantenimiento técnico: indicador semafórico de días de demora en reparación (alerta roja >45 días) y conciliación con remitos. | 5 |
| 28 | **30/11/2026** | Demostración de MVP 2 a Mantenimiento y Bioingeniería | Revisión del módulo de taller con el personal técnico de mantenimiento de la clínica, validando el circuito digital de remitos frente a los cuadernos físicos tradicionales. | 5 |
| 29 | **01/12/2026** | Módulo de consolidación de reportes regulatorios | Desarrollo de consultas analíticas y vistas consolidadas requeridas por inspectores de Regulación Sanitaria del Ministerio de Salud: dotación total, equipos habilitados y remitos vigentes. | 5 |
| 30 | **02/12/2026** | Exportación de informes oficiales en PDF y Excel | Implementación de endpoints y utilitarios para la descarga automatizada de planillas oficiales de activos biomédicos para presentaciones ministeriales y auditorías internas. | 5 |
| 31 | **03/12/2026** | Gestión de perfiles, roles y seguridad | Configuración de control de acceso basado en roles (RBAC): Administrador General (Alejandra), Supervisión de Área (Lunes a Viernes) y Supervisión General de Guardia (24/7). | 5 |
| 32 | **04/12/2026** | Optimización de rendimiento para móviles de guardia | Ajustes de latencia, compresión de payloads JSON y optimización del diseño táctil para garantizar tiempos de respuesta sub-segundo en el celular corporativo de supervisión. | 5 |
| 33 | **09/12/2026** | Migración y carga del inventario real de activos | Ejecución de scripts de carga masiva del maestro oficial de equipos biomédicos desde las planillas vigentes de la clínica hacia la base de datos SQL Server de producción. | 5 |
| 34 | **10/12/2026** | Prueba piloto en guardia activa | Ensayo de operaciones reales en horario de guardia con los supervisores generales: ejecución de préstamos reales, traslados a piso y devoluciones con desinfección LT8. | 5 |
| 35 | **11/12/2026** | Calibración post-piloto y mejoras ergonómicas | Ajustes finos de contraste visual, tamaños de botones táctiles y refinamiento de filtros de búsqueda rápida a partir de las observaciones de las enfermeras supervisoras. | 5 |
| 36 | **14/12/2026** | Capacitación operativa al equipo de Supervisión | Taller de capacitación práctica con supervisores de los cuatro turnos de guardia: uso del móvil corporativo, escaneo de códigos QR, regla de los 3 clics y registro de bioseguridad. | 5 |
| 37 | **15/12/2026** | Capacitación administrativa a Alejandra | Jornada de capacitación sobre el panel de control general: monitoreo de alertas de retención, altas patrimoniales, órdenes de servicio técnico y generación de reportes sanitarios. | 5 |
| 38 | **16/12/2026** | Redacción de manuales operativos y técnicos | Elaboración de la Guía Rápida de Operación para Supervisores de Guardia, Manual Integral del Administrador y especificación técnica de endpoints y arquitectura para Sistemas. | 5 |
| 39 | **17/12/2026** | Redacción de la Memoria Final de PPS | Elaboración de la memoria técnica académica requerida por la UTN FRC: fundamentación metodológica, balance de objetivos, análisis de resultados y lecciones aprendidas. | 5 |
| 40 | **18/12/2026** | Cierre formal y entrega de entregables | Presentación final ante el supervisor institucional Lic. Pablo Bassi y la docente tutora Ing. Mariel Ferrando; entrega formal de código fuente, documentación y suscripción de actas. | 5 |
| **TOTAL** | **19/10 al 19/12** | **Carga Horaria Reglamentaria Cumplida** | **40 Jornadas laborales efectivas de exactamente 5 hs diarias** | **200** |
