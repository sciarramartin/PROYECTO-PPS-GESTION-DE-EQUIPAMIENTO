# Propuesta Técnica
## Gestión de Equipamiento y Trazabilidad - Clínica Privada Vélez Sarsfield

* **Organización:** Clínica Privada Vélez Sarsfield (Córdoba)
* **Autor de la propuesta:** Martín Sciarra (Legajo 69650 - DNI 40.107.751)
* **Destinatarios:** Jefatura de Sistemas / Dirección Médica / Gestión de Equipamiento
* **Versión:** 1.3 (Formato optimizado para exportación oficial a PDF)
* **Fecha:** Octubre 2026

---

## 1. Resumen Ejecutivo

La gestión de equipamiento médico crítico en la Clínica Privada Vélez Sarsfield se encuentra actualmente fragmentada entre planillas de cálculo manuales, libros de guardia en papel dispersos y comunicaciones informales por WhatsApp. Esta situación provoca desabastecimiento de insumos escasos (como el cuello de botella de 42 bombas de infusión para 176 camas), demoras de hasta 3 meses en talleres de mantenimiento y severas vulnerabilidades legales ante auditorías del Ministerio de Salud.

Para resolver este desafío eliminando toda burocracia que frene la atención médica, se propone el desarrollo de una **Aplicación Web Responsive Táctil (PWA/Mobile Web)** concebida bajo la **regla de los 3 clics y menos de 10 segundos**:

1. **Módulo Operativo Ágil en Dispositivo Móvil Corporativo y PC:**  
   Permite a los **Supervisores de Área (Lunes a Viernes)** y a la **Supervisión General (24/7 con teléfono corporativo)** registrar préstamos rápidos mediante una estrategia dual (sticker visible 1..32 o escaneo QR) y confirmar el retorno con protocolo de desinfección **LT8 (5 min) en 1 solo clic**, sin exigir logins individuales a la enfermería de piso ni requerir datos clínicos de pacientes.
2. **Tablero de Control Centralizado (Dashboard de Cabecera):**  
   Provee a la Responsable General de Equipamiento (Alejandra) y a la Dirección un mapa visual en tiempo real de los 22 servicios clínicos, con semáforos de permanencia en taller, alertas preventivas de bombas retenidas (+48 hs en internación) y exportación oficial inmediata con números de remito para la **Dirección General de Regulación Sanitaria**.
3. **Evolución Modular Desacoplada:**  
   La arquitectura REST en capas queda preparada para incorporar módulos conversacionales (Bot de WhatsApp) en etapas posteriores, priorizando en el MVP inicial la solidez del sistema web sin dependencias externas de APIs ni costos de mensajería.

---

## 2. Diagnóstico de la Situación Actual

El relevamiento operativo in situ y la auditoría forense de los archivos preexistentes de la clínica (*Planilla de respiradores.xlsx* y *Convirtiendo a Excel EQUIPAMIENTO CENTRAL.xlsx*) revelaron problemáticas de alto impacto:

* **El Déficit Crítico y la Brecha Oculta de Bombas de Infusión:**  
  La clínica cuenta con un parque total de **42 bombas de infusión para 176 camas**. Al auditar la nómina oficial ministerial, se constató que **sólo 25 bombas están declaradas ante el Ministerio de Salud** (distribuidas en UTI, UTIP, Neo y Oncología). Las **17 bombas restantes circulan en internación general en un limbo administrativo**, lo que explica su extravío crónico y retención prolongada en salas.
* **Desfasaje Legal Severo en Respiradores:**  
  De los 22 respiradores de soporte vital que operan en las terapias, **7 respiradores activos no coinciden con la habilitación oficial del Ministerio**, detectándose incluso un respirador neonatal de alta complejidad registrado internamente como **`"sin número, N.G. NET 003"`** (sin número de serie de fábrica legible).
* **Riesgo Clínico de Pacientes (Equipos Averiados en Sala):**  
  Se detectaron respiradores con fallas documentadas en alarmas de presión (`"no Alarma pres."`) y volumen corriente mínimo (`"falla vt mínimo"`). Al estar la columna `"en reparación"` 100% vacía en la planilla viva, los equipos no están formalmente derivados a taller ni bloqueados por software, permaneciendo a pie de cama con riesgo de conexión a otro paciente.
* **Fragmentación en Libros de Guardia Descentralizados:**  
  No existe un único libro de mantenimiento: cada servicio crítico (**UTI, Área Materno-Infantil, Trasplante**) custodia su propio **"Libro de Entrega y Recibo"** en papel. Cuando los equipos regresan de reparación, la falta de verificación cruzada provoca desvíos de números de serie (ej. se envía el #2025 y se acepta el #1617), corrompiendo el inventario legal.
* **Inviabilidad de Planillas Escaneadas por OCR:**  
  La planilla ministerial central de 356 activos sufre de degradación severa por conversión óptica (marcas corruptas como `LEFTIOU` por Leistung, fechas truncadas en año 1986 y seriales cortados en varias líneas), demostrando la necesidad urgente de migrar a una base de datos relacional limpia.

---

## 3. Requerimientos del Sistema (Épicas e Historias de Usuario)

### ÉPICA 1: Maestro y Catálogo de Activos Serializados
* **HU-1.1:** *Como administradora de equipamiento, quiero registrar activos con su número de serie de fábrica, número de sticker interno (1..32) y servicio base propietario, para individualizar cada máquina física.*
  * **Criterio de Aceptación:** El sistema no permite números de serie duplicados y vincula el activo al catálogo institucional de artículos.
* **HU-1.2:** *Como administradora, quiero distinguir el estado de habilitación ministerial (`habilitado_ministerio = 1/0`) y si es propio o comodato (con CUIT de la empresa), para gestionar la regularización ante Regulación Sanitaria.*
* **HU-1.3 (Estrategia Dual de Identificación):** *Como administradora, quiero generar e imprimir etiquetas que combinen el número visible corto (ej. '14') y un código QR dinámico generado por el sistema, para permitir transferencias ágiles y censos rápidos con cámara.*
  * **Criterio de Aceptación:** La etiqueta es legible a distancia y el escaneo del código QR abre la ficha del equipo en el navegador móvil en menos de 2 segundos.

### ÉPICA 2: Trazabilidad de Traslados y Bioseguridad Ágil
* **HU-2.1 (Préstamo Rápido en 3 Clics):** *Como supervisor de área o de guardia general, quiero transferir un equipo seleccionando su número visible (o escaneando el QR) y eligiendo la habitación/servicio de destino, para registrar la custodia en menos de 10 segundos sin cargar datos médicos del paciente.*
  * **Criterio de Aceptación:** El registro requiere únicamente: identificación del equipo, destino y confirmación; no solicita DNI, Historia Clínica ni contraseñas intermedias.
* **HU-2.2 (Localización Inmediata):** *Como administradora o supervisora, quiero consultar en tiempo real en qué habitación o servicio se encuentra cualquier bomba o respirador.*
  * **Criterio de Aceptación:** La respuesta indica: sede, sector, habitación/cama física y tiempo transcurrido desde el último movimiento.
* **HU-2.3 (Circuito de Retorno Asistido):** *Como Supervisor General, quiero visualizar en el móvil corporativo las bombas que fueron liberadas en internación general, para coordinar su retiro físico hacia el servicio base.*
* **HU-2.4 (Bioseguridad LT8 en 1 Clic):** *Como supervisor que recibe un equipo liberado, quiero confirmar el reingreso tildando obligatoriamente `[✓] Desinfección con LT8 realizada (5 min)`, para que el equipo pase inmediatamente a `DISPONIBLE` con auditoría respaldada en el retorno (`fecha_retorno_real` y `usuario_recibe_id`), sin crear estados intermedios muertos en el sistema.*
  * **Criterio de Aceptación:** Con un solo clic se actualiza el estado a `DISPONIBLE`, se guarda `desinfeccion_realizada = 1` y se asocian silenciosamente el timestamp y el usuario receptor.
* **HU-2.5 (Bloqueo Automático por Falla Crítica):** *Como supervisor, al reportar una falla en alarmas o parámetros ventilatorios, quiero que el sistema cambie el estado inmediatamente a `EN_MANTENIMIENTO` y desvincule el equipo de la cama activa, para evitar que continúe a pie de cama y pueda ser usado con otro paciente.*

### ÉPICA 3: Blindaje del Circuito de Mantenimiento (Control Anti-Fuga)
* **HU-3.1:** *Como supervisor, quiero registrar la salida de un equipo a taller especificando la falla detectada, el tipo de reparación (interna o externa) y asociando el número del Libro de Entrega y Recibo del servicio y remito en papel.*
  * **Criterio de Aceptación:** El estado conmuta a `EN_MANTENIMIENTO` y queda registrado el servicio propietario emisor.
* **HU-3.2 (Validación Estricta de Número de Serie):** *Como supervisora al recibir un equipo devuelto de mantenimiento, quiero que el sistema me obligue a verificar el número de serie de fábrica físico.*
  * **Criterio de Aceptación:** Si el número de serie físico devuelto difiere del registrado en la orden de salida (ej. #1617 por #2025), el sistema bloquea el reingreso automático y emite una alerta roja de discrepancia patrimonial.
* **HU-3.3:** *Como administradora, quiero registrar el número de remito del service externo oficial en la orden, para exhibirlo como comprobante legal ante inspecciones ministeriales.*

### ÉPICA 4: Monitoreo, Alertas y Prevención de Retención
* **HU-4.1 (Semáforo de Demoras en Taller):** *Como jefa de equipamiento, quiero visualizar un semáforo de permanencia en taller (Verde: <15 días, Amarillo: 15-45 días, Rojo: >45 días), para formalizar reclamos con datos precisos.*
* **HU-4.2 (Alerta de Retención en Sala +48 hs):** *Como administradora y supervisión general, quiero visualizar en el tablero qué bombas de infusión superaron las 48 horas en una habitación de internado, para gestionar su liberación y restitución a las terapias.*

### ÉPICA 5: Informes y Auditoría Regulatoria
* **HU-5.1 (Exportación Ministerial en 1 Clic):** *Como directiva, quiero exportar la planilla oficial de equipamiento en el formato exigido por la Dirección General de Regulación Sanitaria de Córdoba.*
  * **Criterio de Aceptación:** El reporte incluye marca, modelo, número de serie, servicio habilitado y, en caso de equipos en taller, el número de remito oficial que justifica su ausencia.

---

## 4. Pila Tecnológica Propuesta (Stack Tecnológico)

La solución aprovecha la infraestructura instalada de la clínica y utiliza tecnologías modernas y de bajo mantenimiento:

* **Base de Datos Institucional:**
  * **Microsoft SQL Server (Transact-SQL):** Reutilización de tablas maestras existentes (`sucursales`, `depositos`, `habitaciones`, `articulos`, `usuarios`) y creación de las entidades normalizadas de trazabilidad (`ubicaciones`, `equipos_biomedicos`, `movimientos_equipos`, `mantenimientos_equipos`).
* **Backend / Capa de Servicios:**
  * **Node.js (Express / TypeScript) o .NET Web API:** Arquitectura modular en tres capas (Controladores, Servicios, Repositorios) con autenticación basada en JWT, transacciones ACID para transferencias concurrentes y validación de reglas de negocio.
* **Frontend / Aplicación Web:**
  * **React.js + Vite + Tailwind CSS:** Aplicación Web Responsive (PWA) optimizada para interfaz táctil en el smartphone corporativo de la Supervisión General (24/7) y pantallas de escritorio de administración.
* **Módulo de Identificación y Escaneo:**
  * **Librería de Generación QR + HTML5 Camera Scanner:** Renderizado de etiquetas con diseño imprimible estandarizado y lector por cámara web/smartphone sin requerir hardware adicional de escaneo.
* **Entorno y Repositorio:**
  * **Git / GitHub:** Control de versiones, ramas por features y respaldo seguro del código.

---

## 5. Requerimientos No Funcionales

* **Usabilidad de Emergencia (Zero-Friction):** Los flujos de traslado y reingreso con desinfección deben completarse en un máximo de 3 toques/clics y tomar menos de 10 segundos.
* **Arquitectura de Roles Centralizada:** Se definen 4 perfiles estrictos (`ADMIN`, `SUPERVISOR_AREA`, `SUPERVISOR_GENERAL`, `TECNICO`), liberando a enfermería raso de la gestión de claves personales en terminales compartidas.
* **Integridad y Trazabilidad Inmutable:** Cada movimiento registra silenciosamente timestamps del servidor y el ID del usuario responsable, sin permitir sobreescrituras arbitrarias.
* **Disponibilidad 24/7:** La API y la aplicación web deben operar de forma continua para dar soporte a las guardias nocturnas y de fin de semana.

---

## 6. Plan de Entregas e Iteraciones (Roadmap Ágil)

El desarrollo se estructura en **tres hitos o MVPs (Producto Mínimo Viable)** alineados estrictamente al cronograma formal de 200 horas de práctica profesional (19 de octubre al 19 de diciembre de 2026):

| Hito / MVP | Período Estimado | Foco Principal | Entregables y Funcionalidades Incluidas |
| :--- | :---: | :--- | :--- |
| **MVP 1: Núcleo Operativo y Trazabilidad Base** | Semanas 1 a 3<br>*(19/10 al 06/11)* | Inventario en vivo y transferencias ágiles sin burocracia | • Catálogo maestro de equipos serializados con estrategia dual (Sticker 1..32 y código QR).<br>• Tabla unificada de `ubicaciones` (vinculando depósitos de servicios y habitaciones).<br>• Tablero Web Dashboard con recuento en tiempo real de bombas y respiradores por servicio.<br>• Módulo de registro de préstamos rápidos en 3 clics para móvil corporativo y PC.<br>• Registro de devolución y confirmación de bioseguridad LT8 (5 min) en 1 solo clic. |
| **MVP 2: Blindaje de Taller y Mantenimiento** | Semanas 4 a 6<br>*(09/11 al 27/11)* | Control anti-fuga y seguimiento de reparaciones | • Módulo digital de órdenes de mantenimiento interno y service técnico externo.<br>• Vinculación de órdenes con los folios de los Libros de Entrega y Recibo descentralizados.<br>• Validación obligatoria de número de serie físico al retorno para evitar canjes erróneos.<br>• Semáforo visual de demoras en taller (Verde <15 días, Amarillo 15-45 días, Rojo >45 días).<br>• Bloqueo automático por falla crítica de soporte vital (retiro inmediato de cama activa). |
| **MVP 3: Auditoría Ministerial y Despliegue Piloto** | Semanas 7 a 9<br>*(30/11 al 19/12)* | Cumplimiento regulatorio, alertas y cierre | • Módulo de exportación oficial para la Dirección General de Regulación Sanitaria.<br>• Alertas automáticas de retención indebida de bombas (+48 horas en internación).<br>• Prueba piloto en entorno real durante guardias activas con Supervisión General (24/7).<br>• Capacitación a usuarios clave (Alejandra, supervisores de área y guardia).<br>• Elaboración de manuales operativos, memoria técnica y cierre formal de la práctica. |

---

## 7. Beneficios Tangibles para la Clínica

1. **Eliminación del Extravío de Bombas de Infusión:** Control en tiempo real de las 42 unidades, reduciendo tiempos muertos y garantizando stock inmediato en UTI, UTIP y Neonatología.
2. **Regularización y Blindaje Sanitario:** Base sólida y documentada para regularizar las 17 bombas y los 7 respiradores ante la Dirección General de Regulación Sanitaria, suprimiendo riesgos de multas o clausuras.
3. **Seguridad del Paciente:** Retiro y bloqueo informático automático de respiradores con fallas de alarmas o volumen, evitando su uso accidental.
4. **Cero Fuga en Mantenimiento:** Erradicación del intercambio indebido de aparatos al retorno del service técnico mediante validación estricta de números de serie.
5. **Ahorro de Horas Hombre:** Sustitución de censos manuales telefónicos y planillas OCR degradadas por un panel web visual accesible las 24 horas.
