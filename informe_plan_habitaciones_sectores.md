# Informe Técnico y Plan de Implementación: Modelo de Habitaciones y Sectores

## 1. Diagnóstico del Script del Sistema Viejo (`[selfcontrol]`)

Al inspeccionar `scripthabitaciones.sql`, se constata la estructura de las tablas existentes:

```
[dbo].[Sector] (PK: sector)
      │
      ├── [id_sucursal] ────────> Vincula con sucursales (Central, Norte, Ruta 20)
      │
      ▼ (FK_HABITACI_4833_SECTOR)
[dbo].[habitaciones]
      ├── [nro_habitacion] ─┐
      ├── [cama]           ─┼──> PK COMPUESTA DE 3 CAMPOS: (nro_habitacion, cama, sector)
      ├── [sector]         ─┘
      ├── [tipo_habitacion] ────> FK a [dbo].[tipo_habitacion]
      ├── [baja]            ────> Fecha de inhabilitación (Borrado lógico)
      └── [oxigeno]
```

---

## 2. Evaluación de las 3 Opciones de Implementación

### Opción A: Usar Directamente las Tablas Viejas (Acoplamiento Total)
Consiste en no crear ninguna tabla intermedia y relacionar nuestros movimientos directamente contra `[dbo].[habitaciones]` y `[dbo].[depositos]`.

* **Cómo quedaría la BD:** En `movimientos_equipos` y `equipos_biomedicos` tendríamos que agregar 4 columnas de destino:
  * `tipo_destino VARCHAR(10)` (`'DEPOSITO'` o `'HABITACION'`)
  * `id_deposito NUMERIC(18,0) NULL`
  * `nro_habitacion NUMERIC(4,0) NULL`
  * `cama CHAR(1) NULL`
  * `sector NUMERIC(3,0) NULL`
* **Desventajas:**
  * **Violación de buenas prácticas:** Genera claves foráneas polimórficas (si es depósito, sobran 3 columnas; si es habitación, sobra 1).
  * **Consultas y JOINs muy lentos y pesados:** Para consultar la ubicación actual en el celular corporativo habría que hacer JOINs condicionales contra `habitaciones`, `Sector` y `depositos`.
  * **Riesgo:** Si el sistema viejo altera o traba registros de habitaciones, puede afectar la operatoria de trazabilidad.

---

### Opción B: Capa Unificadora `ubicaciones` con Puntero al Sistema Viejo (⭐ RECOMENDADA)
Es la solución de arquitectura que ya propusimos en nuestro diseño, pero ahora adaptada a la realidad exacta de `scripthabitaciones.sql`.

* **Cómo funciona:**
  * Mantenemos nuestra tabla `ubicaciones` con una clave primaria simple y ultrarrápida: `id_ubicacion INT IDENTITY(1,1) PK`.
  * En lugar de tener un supuesto `id_habitacion_legacy`, adaptamos los campos de referencia:
    ```sql
    id_deposito_legacy     NUMERIC(18,0) NULL, -- Si es UTI, UTIP, Taller, etc.
    nro_habitacion_legacy  NUMERIC(4,0)  NULL, -- Si es cama de internado
    cama_legacy            CHAR(1)       NULL, 
    sector_legacy          NUMERIC(3,0)  NULL
    ```
  * **Sincronización:** Creamos una **Vista en SQL Server** (`vw_sincronizacion_camas`) o un procedimiento almacenado que lea de `[dbo].[habitaciones]` y `[dbo].[Sector]` (filtrando `WHERE baja IS NULL`) y pueble/actualice nuestra tabla `ubicaciones`.
* **Ventajas:**
  * **No rompe nada del sistema viejo:** Lee los datos de `selfcontrol` sin modificar sus estructuras ni sus triggers.
  * **App ultrarrápida (menos de 2 segundos):** Para transferir una bomba en el celular de guardia, la app solo manipula un entero simple: `id_ubicacion`.
  * **Homogeneidad:** Unifica depósitos y habitaciones en un solo catálogo desplegable para enfermería.

---

### Opción C: Modelo 100% Desacoplado e Independiente (Nueva Forma Propia)
La aplicación de trazabilidad gestiona su propio maestro de habitaciones y sectores en tablas nuevas, sin conectarse con `[dbo].[habitaciones]`.

* **Cómo funciona:** Se hace una carga inicial única (seed) de las 176 camas y los servicios, y la app se desentiende de la base `selfcontrol`.
* **Ventajas:** Cero acoplamiento, máxima independencia de desarrollo.
* **Desventajas:** Si en la clínica crean una habitación nueva o dan de baja una cama en el sistema viejo, un administrador tendría que duplicar la carga en la app.

---

## 3. Matriz Comparativa para la Toma de Decisión

| Criterio | Opción A (Sistema Viejo Directo) | Opción B (Capa Unificadora con Mapeo - Recomendada) | Opción C (Desacoplado Propio) |
| :--- | :---: | :---: | :---: |
| **Simplicidad en la App (Regla 3 clics)** | ❌ Baja (JOINs y FKs compuestas) | ✅ **Máxima (1 sola clave `id_ubicacion`)** | ✅ Máxima |
| **No romper el sistema existente** | ⚠️ Riesgoso (alto acoplamiento) | ✅ **100% Seguro (Lectura no invasiva)** | ✅ 100% Seguro |
| **Compatibilidad con Camas y Depósitos** | ❌ Pésima (Polimorfismo forzado) | ✅ **Excelente (Unifica ambos conceptos)** | ⚠️ Regular (Duplica catálogo) |
| **Mantenimiento y Evolución** | ❌ Complejo y rígido | ✅ **Limpio y escalable** | ⚠️ Requiere doble carga |
