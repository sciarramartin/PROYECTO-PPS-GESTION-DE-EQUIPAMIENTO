# Product Backlog Refinado (Groomed Backlog)
## Gestión de Equipamiento y Trazabilidad - Clínica Privada Vélez Sarsfield

* **Proyecto:** Sistema de Gestión, Trazabilidad y Bioseguridad de Equipamiento Biomédico
* **Responsable Técnico:** Martín Sciarra (Legajo 69650 - DNI 40.107.751)
* **Organización:** Clínica Privada Vélez Sarsfield (Córdoba)
* **Metodología:** Ágil (Scrum / Kanban) - Estimación en Story Points (Escala Fibonacci)
* **Estado:** Grooming completado (Historias de Usuario atomizadas, priorizadas y estimadas sin épicas)

---

## 1. Tabla Resumen del Product Backlog Priorizado

| ID | Historia de Usuario | Prioridad | Estimación (SP) | MVP Objetivo | Dependencias |
| :-: | :--- | :-: | :-: | :-: | :-: |
| **US-01** | Visualización del Tablero Central de Disponibilidad | Crítica (P1) | 5 SP | **MVP 1** | Ninguna |
| **US-02** | Alta y Maestro de Equipos con Identificación Dual | Crítica (P1) | 5 SP | **MVP 1** | Ninguna |
| **US-03** | Generación e Impresión de Etiquetas Duales (Sticker + QR) | Alta (P2) | 3 SP | **MVP 1** | US-02 |
| **US-04** | Mapeo y Consulta de Ubicaciones Unificadas | Crítica (P1) | 3 SP | **MVP 1** | Ninguna |
| **US-05** | Registro de Préstamo Rápido en 3 Clics (Móvil y PC) | Crítica (P1) | 5 SP | **MVP 1** | US-02, US-04 |
| **US-06** | Localización Inmediata de Activos en Tiempo Real | Alta (P2) | 2 SP | **MVP 1** | US-05 |
| **US-07** | Reingreso de Equipo con Tilde de Bioseguridad LT8 | Crítica (P1) | 5 SP | **MVP 1** | US-05 |
| **US-08** | Bloqueo Inmediato por Falla Crítica (Anti-Uso en Sala) | Crítica (P1) | 3 SP | **MVP 2** | US-02 |
| **US-09** | Registro Digital de Salida a Mantenimiento (Libros de Guardia) | Alta (P2) | 5 SP | **MVP 2** | US-02, US-04 |
| **US-10** | Validación Estricta Anti-Intercambio de Serial al Retorno | Crítica (P1) | 5 SP | **MVP 2** | US-09 |
| **US-11** | Carga y Asociación de Remitos Oficiales de Service Externo | Media (P3) | 3 SP | **MVP 2** | US-09 |
| **US-12** | Semáforo Visual de Envejecimiento en Mantenimiento | Media (P3) | 3 SP | **MVP 2** | US-09 |
| **US-13** | Alerta Preventiva de Bombas Retenidas (+48 hs en Internación) | Alta (P2) | 3 SP | **MVP 3** | US-05 |
| **US-14** | Gestión y Filtro de Habilitación Ministerial | Media (P3) | 3 SP | **MVP 3** | US-02 |
| **US-15** | Exportación de Planilla Oficial para Regulación Sanitaria | Alta (P2) | 5 SP | **MVP 3** | US-02, US-11 |
| **US-16** | Auditoría Completa e Historial Inmutable de Movimientos | Media (P3) | 3 SP | **MVP 3** | US-05, US-07 |
| **TOTAL** | **16 Historias de Usuario Refinadas** | — | **61 SP** | **3 Sprints** | — |

* **Distribución de Carga por Iteración:**
  * **MVP 1 (Semanas 1 a 3):** 28 Story Points (Núcleo Operativo y Trazabilidad Base).
  * **MVP 2 (Semanas 4 a 6):** 19 Story Points (Blindaje de Taller y Control Anti-Fuga).
  * **MVP 3 (Semanas 7 a 9):** 14 Story Points (Auditoría Ministerial, Alertas y Despliegue Piloto).

---

## 2. Detalle de Historias de Usuario (Groomed Stories)

```
================================================================================
FASE 1: MVP 1 - NÚCLEO OPERATIVO Y TRAZABILIDAD BASE (SEMANAS 1 A 3)
================================================================================
```

### US-01: Visualización del Tablero Central de Disponibilidad
* **Prioridad:** Crítica (P1)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Responsable de Equipamiento (Alejandra) o Supervisor de Guardia,
  * **Quiero:** Visualizar un tablero visual con el conteo en tiempo real de bombas de infusión (42) y respiradores (22), agrupados por servicio base y discriminando entre unidades `DISPONIBLES`, `EN_USO` y `EN_MANTENIMIENTO`,
  * **Para:** Conocer en menos de 5 segundos la disponibilidad real de insumos críticos sin tener que realizar censos manuales por teléfono o planillas desactualizadas.
* **Criterios de Aceptación:**
  1. El tablero carga en menos de 2 segundos al ingresar al sistema.
  2. Muestra un resumen numérico superior de bombas (Total: 42, Disponibles, En Paciente, En Taller).
  3. Desglosa los totales por cada uno de los servicios propietarios (UTI, UTIP, Neo, Quirófano, Pisos, etc.).
  4. Los datos se actualizan automáticamente ante cualquier movimiento registrado sin requerir recargar la página.
* **Reglas de Negocio / Notas:**  
  La interfaz debe diseñarse con contrastes aptos para visualización rápida tanto en monitores de PC como en el móvil corporativo de guardia.

---

### US-02: Alta y Maestro de Equipos con Identificación Dual
* **Prioridad:** Crítica (P1)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Administradora de Equipamiento,
  * **Quiero:** Registrar y modificar activos biomédicos serializados vinculándolos al catálogo maestro de artículos, asignando su número de serie de fábrica, número de sticker visible (1..32), código QR y servicio base propietario,
  * **Para:** Individualizar unívocamente cada aparato físico y erradicar la confusión de máquinas del mismo modelo.
* **Criterios de Aceptación:**
  1. El sistema valida y bloquea el registro de números de serie duplicados en la base de datos.
  2. Permite ingresar el número visible de sticker (ej. "14" para bombas Lexx) y genera un token único para el código QR.
  3. Requiere definir el depósito/servicio propietario (patrimonial) y el estado operativo inicial (`DISPONIBLE`).
  4. Registra si el equipo es propio o en comodato/tercerizado (con CUIT de la empresa).
* **Reglas de Negocio / Notas:**  
  Permite ingresar observaciones iniciales para subsanar casos irregulares detectados en el relevamiento (ej. equipos con seriales poco legibles o en trámite de compra).

---

### US-03: Generación e Impresión de Etiquetas Duales (Sticker + QR)
* **Prioridad:** Alta (P2)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Administradora de Equipamiento,
  * **Quiero:** Generar una plantilla estandarizada de impresión que contenga el número visible corto en tipografía grande junto al código QR de alta densidad correspondiente al equipo,
  * **Para:** Rotular físicamente el parque de bombas y respiradores permitiendo tanto la lectura ocular a distancia como el escaneo rápido con cámara.
* **Criterios de Aceptación:**
  1. La interfaz permite seleccionar un equipo individual o un lote completo para imprimir.
  2. El diseño de la etiqueta incluye: Logotipo institucional, nombre del activo, número visible destacado (ej. "28") y código QR nítido.
  3. El formato de salida es compatible con impresoras de etiquetas autoadhesivas estándar y hojas A4 (PDF listo para imprimir).
  4. Al escanear el QR impreso con la cámara del celular corporativo, se abre directamente la pantalla de consulta/traslado del equipo en menos de 2 segundos.

---

### US-04: Mapeo y Consulta de Ubicaciones Unificadas
* **Prioridad:** Crítica (P1)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Desarrollador y Administradora,
  * **Quiero:** Consolidar en una tabla unificada (`ubicaciones`) los servicios clínicos preexistentes (`depositos`) y las camas de internación (`habitaciones`), organizados por sucursal (Central, Norte, Ruta 20),
  * **Para:** Permitir transferir equipamiento indistintamente entre servicios cerrados o habitaciones individuales de internado general sin romper las tablas legadas del sistema.
* **Criterios de Aceptación:**
  1. La tabla `ubicaciones` mapea correctamente los depósitos clínicos existentes de `scriptstock.sql` y las camas de la tabla `habitaciones`.
  2. Cada registro contiene nombre descriptivo (ej. "Piso 2 - Habitación 214", "UTI Central"), tipo de ubicación y piso/sector.
  3. Provee un selector desplegable autocompletable en el frontend filtrado por sucursal y servicio.

---

### US-05: Registro de Préstamo Rápido en 3 Clics (Móvil y PC)
* **Prioridad:** Crítica (P1)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Supervisor de Área o Supervisor General de Guardia (24/7),
  * **Quiero:** Registrar el traslado de una bomba o respirador seleccionando el equipo por su número visible (o escaneo de QR) y la habitación/servicio de destino mediante máximo 3 interacciones táctiles en pantalla,
  * **Para:** Cumplir con la custodia del activo en menos de 10 segundos sin entorpecer la urgencia médica y sin tener que cargar datos clínicos del paciente.
* **Criterios de Aceptación:**
  1. El formulario exige únicamente tres datos: Identificación del Equipo (tipeo de sticker 1..32 o escaneo de QR), Ubicación Destino (dropdown rápido) y botón "Confirmar Préstamo".
  2. No solicita DNI, nombre de paciente, Historia Clínica ni contraseñas adicionales.
  3. Al confirmar, el estado del equipo pasa automáticamente a `EN_USO` y su `ubicacion_actual_id` se actualiza al destino seleccionado.
  4. La transacción registra silenciosamente en `movimientos_equipos`: fecha de salida (`GETDATE()`), usuario emisor (`usuario_envia_id`) y calcula automáticamente la fecha estimada de retorno (`fecha_salida + 48 hs`).

---

### US-06: Localización Inmediata de Activos en Tiempo Real
* **Prioridad:** Alta (P2)  
* **Estimación:** 2 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Supervisora de Área o Alejandra,
  * **Quiero:** Ingresar el número de sticker (ej. "14") o escanear el código QR en un buscador rápido,
  * **Para:** Conocer inmediatamente en qué piso, habitación o cama se encuentra operando la máquina y cuánto tiempo lleva allí.
* **Criterios de Aceptación:**
  1. El buscador ofrece autocompletado en tiempo real al ingresar 1 o 2 dígitos.
  2. La respuesta indica: Marca, modelo, número de serie, servicio propietario, habitación física actual y fecha/hora del traslado.
  3. Si el equipo está en mantenimiento, indica claramente que está en taller técnico.

---

### US-07: Reingreso de Equipo con Tilde de Bioseguridad LT8 en 1 Clic
* **Prioridad:** Crítica (P1)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 1  
* **Estructura Ágil:**
  * **Como:** Supervisor que recibe un equipo retornado a su servicio base,
  * **Quiero:** Confirmar la restitución del activo mediante un tilde obligatorio que certifique el cumplimiento del protocolo de desinfección con producto LT8 (5 min de contacto),
  * **Para:** Que el equipo pase inmediatamente a `DISPONIBLE` asegurando la trazabilidad sanitaria sin crear estados intermedios burocráticos que desfasen el sistema.
* **Criterios de Aceptación:**
  1. El modal de confirmación de retorno presenta el checkbox obligatorio: `[✓] Desinfección con LT8 realizada (Protocolo 5 min)`.
  2. Si el checkbox no está marcado, el botón de confirmar permanece deshabilitado.
  3. Al confirmar, el estado del equipo conmuta directamente a `DISPONIBLE`, se asigna su `ubicacion_actual_id` al servicio propietario y se guarda `desinfeccion_realizada = 1` en el movimiento.
  4. Los metadatos de auditoría legal quedan respaldados de forma transparente mediante `fecha_retorno_real = GETDATE()` y `usuario_recibe_id = ID del usuario logueado`.

---

```
================================================================================
FASE 2: MVP 2 - BLINDAJE DE TALLER Y MANTENIMIENTO (SEMANAS 4 A 6)
================================================================================
```

### US-08: Bloqueo Inmediato por Falla Crítica (Anti-Uso en Sala)
* **Prioridad:** Crítica (P1)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 2  
* **Estructura Ágil:**
  * **Como:** Supervisor de Área o de Guardia,
  * **Quiero:** Reportar una falla técnica de soporte vital (alarma de presión inoperativa, falla de volumen corriente/tidal mínimo o display averiado),
  * **Para:** Que el sistema bloquee el equipo de inmediato pasándolo a `EN_MANTENIMIENTO` y desvinculándolo de la cama activa, impidiendo que sea conectado por error a otro paciente en una emergencia.
* **Criterios de Aceptación:**
  1. La interfaz ofrece un botón de reporte de falla rápida desde la ficha del equipo.
  2. Requiere seleccionar el tipo de falla o ingresar una descripción breve del síntoma.
  3. Al confirmar, el equipo queda inhabilitado para préstamos o asignaciones a camas.
  4. Aparece destacado visualmente con badge rojo de advertencia en el tablero general.

---

### US-09: Registro Digital de Salida a Mantenimiento (Libros Descentralizados)
* **Prioridad:** Alta (P2)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 2  
* **Estructura Ágil:**
  * **Como:** Supervisor o Encargado de Mantenimiento,
  * **Quiero:** Registrar la entrega de un equipo averiado a reparación especificando si es taller interno o derivación externa, vinculando el número de remito en papel y el folio del Libro de Entrega y Recibo del servicio,
  * **Para:** Eliminar el "agujero negro" de reparaciones y unificar digitalmente los cuadernos dispersos de UTI, Materno-Infantil y Trasplante.
* **Criterios de Aceptación:**
  1. El formulario solicita: Equipo, Falla declarada, Tipo de Taller (`INTERNO` / `EXTERNO`), Proveedor oficial (ej. Tecme, Leistung) y Número de Folio / Remito físico.
  2. Genera una orden de mantenimiento abierta en la tabla `mantenimientos_equipos`.
  3. Descuenta la unidad del stock operativo del servicio propietario sin darlo de baja patrimonial.

---

### US-10: Validación Estricta Anti-Intercambio de Serial al Retorno
* **Prioridad:** Crítica (P1)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 2  
* **Estructura Ágil:**
  * **Como:** Supervisora que recibe un equipo devuelto por el taller técnico,
  * **Quiero:** Que el sistema me exija tipear o escanear obligatoriamente el número de serie de fábrica físico del aparato recibido,
  * **Para:** Compararlo con el serial original de salida y bloquear la recepción si el service devolvió un aparato equivocado (evitando confusiones como el respirador #2025 vs #1617).
* **Criterios de Aceptación:**
  1. Al registrar el reingreso, el campo "Confirmar Número de Serie Físico" es obligatorio y no autocompletado.
  2. Si el serial ingresado coincide exactamente con el registrado al momento de la salida, la orden se cierra como `CERRADA` y el equipo vuelve a su servicio.
  3. Si el serial difiere, el sistema **bloquea el cierre de la orden**, emite una alerta roja en pantalla y notifica una inconsistencia patrimonial a Alejandra.

---

### US-11: Carga y Asociación de Remitos Oficiales de Service Externo
* **Prioridad:** Media (P3)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 2  
* **Estructura Ágil:**
  * **Como:** Administradora de Equipamiento,
  * **Quiero:** Cargar y asociar el número de remito oficial emitido por el servicio técnico externo a la orden de mantenimiento correspondiente,
  * **Para:** Respaldar legalmente ante los inspectores de Regulación Sanitaria por qué una máquina habilitada no está presente en la clínica.
* **Criterios de Aceptación:**
  1. Permite adjuntar el número oficial del remito comercial (ej. `0001-00049210`).
  2. La orden permite visualizar el historial de services previos de cada número de serie.

---

### US-12: Semáforo Visual de Envejecimiento en Mantenimiento
* **Prioridad:** Media (P3)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 2  
* **Estructura Ágil:**
  * **Como:** Jefa de Equipamiento (Alejandra),
  * **Quiero:** Visualizar una columna con indicador semafórico de permanencia en taller según los días transcurridos desde el envío: Verde (<15 días), Amarillo (15 a 45 días) y Rojo (>45 días),
  * **Para:** Identificar equipos demorados y formalizar reclamos fundados con fecha exacta ante el taller o proveedor.
* **Criterios de Aceptación:**
  1. El semáforo calcula automáticamente los días corridos: `DATEDIFF(day, fecha_envio, GETDATE())`.
  2. Permite ordenar la tabla de taller de mayor a menor antigüedad de reparación.
  3. Los equipos con más de 45 días emiten un indicador de reclamo prioritario.

---

```
================================================================================
FASE 3: MVP 3 - AUDITORÍA MINISTERIAL, ALERTAS Y DESPLIEGUE PILOTO (SEMANAS 7 A 9)
================================================================================
```

### US-13: Alerta Preventiva de Bombas Retenidas (+48 hs en Internación)
* **Prioridad:** Alta (P2)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 3  
* **Estructura Ágil:**
  * **Como:** Supervisor General (24/7) y Alejandra,
  * **Quiero:** Visualizar una sección de alertas automáticas destacando aquellas bombas de infusión que lleven más de 48 horas continuas en una habitación de internado general,
  * **Para:** Coordinar activamente el retiro físico de la máquina liberada y devolverla a las terapias intensivas, evitando la retención indebida en pisos.
* **Criterios de Aceptación:**
  1. La alerta se activa automáticamente cuando `fecha_salida` supera las 48 horas sin confirmación de retorno.
  2. Muestra: Número de bomba, habitación física actual, tiempo exacto transcurrido y botón de acción directa "Coordinar Retiro".
  3. Desaparece del panel de alertas en el instante en que el supervisor confirma la devolución con desinfección LT8.

---

### US-14: Gestión y Filtro de Habilitación Ministerial
* **Prioridad:** Media (P3)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 3  
* **Estructura Ágil:**
  * **Como:** Administradora de Equipamiento,
  * **Quiero:** Clasificar y filtrar los equipos según su condición ante el Ministerio (`habilitado_ministerio = 1` vs `0`),
  * **Para:** Monitorear y gestionar la regularización documental de las 17 bombas y 7 respiradores que actualmente circulan en internación fuera de la planilla ministerial.
* **Criterios de Aceptación:**
  1. Permite filtrar el inventario completo entre "Habilitados Formalmente" y "En Trámite / Flota Internación".
  2. Genera un reporte comparativo que evidencia las diferencias entre las camas habilitadas y los activos reales.

---

### US-15: Exportación de Planilla Oficial para Regulación Sanitaria
* **Prioridad:** Alta (P2)  
* **Estimación:** 5 Story Points  
* **MVP Objetivo:** MVP 3  
* **Estructura Ágil:**
  * **Como:** Directivo o Administradora de la Clínica,
  * **Quiero:** Exportar en PDF o Excel con un solo clic el reporte consolidado de equipamiento biomédico estructurado en el formato exacto exigido por la Dirección General de Regulación Sanitaria de Córdoba,
  * **Para:** Presentarlo de forma inmediata ante inspecciones sanitarias de sorpresa, adjuntando automáticamente los números de remito de los equipos ausentes por mantenimiento.
* **Criterios de Aceptación:**
  1. La exportación replica fielmente los campos ministeriales: Servicio, Equipo, Marca, Modelo, Número de Serie, Tipo de Mantenimiento, Fecha de Último Service, Condición (Propio/Comodato) y CUIT.
  2. Si un equipo está en service externo, la celda de observación adjunta automáticamente el número de remito oficial registrado en el sistema.
  3. La descarga se completa en menos de 3 segundos en formato compatible con impresión y archivo digital.

---

### US-16: Auditoría Completa e Historial Inmutable de Movimientos
* **Prioridad:** Media (P3)  
* **Estimación:** 3 Story Points  
* **MVP Objetivo:** MVP 3  
* **Estructura Ágil:**
  * **Como:** Administradora o Auditor del Comité de Control de Infecciones,
  * **Quiero:** Consultar el registro histórico inmutable de traslados, préstamos, desinfecciones y cambios de servicio de cualquier máquina,
  * **Para:** Contar con trazabilidad retrospectiva ante investigaciones clínicas, extravíos o auditorías internas.
* **Criterios de Aceptación:**
  1. La vista histórica muestra la línea de tiempo completa del activo: cada origen, destino, fecha/hora exacta y usuario interviniente.
  2. Muestra fehacientemente si cada retorno cumplió con el protocolo de desinfección LT8.
  3. Los registros históricos son de solo lectura y no pueden ser alterados ni borrados por ningún perfil de usuario.
