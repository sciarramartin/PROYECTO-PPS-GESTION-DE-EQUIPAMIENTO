import subprocess
import urllib.request
import urllib.error
import json
import time

def get_github_token():
    p = subprocess.run(
        ['git', 'credential', 'fill'],
        input='protocol=https\nhost=github.com\n',
        capture_output=True,
        text=True,
        check=True
    )
    for line in p.stdout.splitlines():
        if line.startswith('password='):
            return line.split('=', 1)[1]
    raise RuntimeError('GitHub token not found in git credentials')

USER_STORIES = [
    {
        "id": "US-01",
        "title": "US-01: Visualización del Tablero Central de Disponibilidad",
        "body": """### Como
Responsable de Equipamiento (Alejandra) o Supervisor de Guardia,

### Quiero
Visualizar un tablero visual con el conteo en tiempo real de bombas de infusión (42) y respiradores (22), agrupados por servicio base y discriminando entre unidades `DISPONIBLES`, `EN_USO` y `EN_MANTENIMIENTO`,

### Para
Conocer en menos de 5 segundos la disponibilidad real de insumos críticos sin tener que realizar censos manuales por teléfono o planillas desactualizadas.

---
**Prioridad:** Crítica (P1) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Carga en menos de 2s.
2. Resumen superior de bombas (42) y respiradores (22) con estados.
3. Desglose por servicios clínicos propietarios.
4. Reactivo en tiempo real.""",
        "labels": ["mvp-1", "prioridad-alta", "frontend", "backend"],
        "completed_today": True
    },
    {
        "id": "US-02",
        "title": "US-02: Alta y Maestro de Equipos con Identificación Dual",
        "body": """### Como
Administradora de Equipamiento,

### Quiero
Registrar y consultar activos biomédicos serializados vinculándolos al catálogo maestro de artículos, asignando su número de serie de fábrica, número de sticker visible (1..32), código QR y servicio base propietario,

### Para
Individualizar unívocamente cada aparato físico y erradicar la confusión de máquinas del mismo modelo.

---
**Prioridad:** Crítica (P1) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Valida unicidad de número de serie y código QR.
2. Soporta sticker visible y QR.
3. Asignación de servicio patrimonial y estado operativo.
4. Distinción entre propio y comodato.""",
        "labels": ["mvp-1", "prioridad-alta", "database", "backend"],
        "completed_today": True
    },
    {
        "id": "US-03",
        "title": "US-03: Generación e Impresión de Etiquetas Duales (Sticker + QR)",
        "body": """### Como
Administradora de Equipamiento,

### Quiero
Generar una plantilla estandarizada de impresión que contenga el número visible corto en tipografía grande junto al código QR de alta densidad correspondiente al equipo,

### Para
Rotular físicamente el parque de bombas y respiradores permitiendo tanto la lectura ocular a distancia como el escaneo rápido con cámara.

---
**Prioridad:** Alta (P2) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Selección individual o lote.
2. Logotipo institucional CPVS + número destacado + QR nítido.
3. Formato PDF listo para imprimir en etiquetas autoadhesivas.""",
        "labels": ["mvp-1", "prioridad-media", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-04",
        "title": "US-04: Mapeo y Consulta de Ubicaciones Unificadas",
        "body": """### Como
Desarrollador y Administradora,

### Quiero
Consolidar en una tabla unificada (`ubicaciones`) los servicios clínicos preexistentes (`depositos`) y las camas de internación (`habitaciones`), organizados por sucursal (Central, Norte, Ruta 20),

### Para
Permitir transferir equipamiento indistintamente entre servicios cerrados o habitaciones individuales de internado general sin romper las tablas legadas del sistema.

---
**Prioridad:** Crítica (P1) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Mapea depósitos clínicos de `scriptstock.sql` y camas de `habitaciones`.
2. Incluye nombre descriptivo, piso, sector y sucursal.
3. Selector autocompletable en frontend.""",
        "labels": ["mvp-1", "prioridad-alta", "database", "backend"],
        "completed_today": True
    },
    {
        "id": "US-05",
        "title": "US-05: Registro de Préstamo Rápido en 3 Clics (Móvil y PC)",
        "body": """### Como
Supervisor de Área o Supervisor General de Guardia (24/7),

### Quiero
Registrar el traslado de una bomba o respirador seleccionando el equipo por su número visible (o escaneo de QR) y la habitación/servicio de destino mediante máximo 3 interacciones táctiles en pantalla,

### Para
Cumplir con la custodia del activo en menos de 10 segundos sin entorpecer la urgencia médica y sin tener que cargar datos clínicos del paciente.

---
**Prioridad:** Crítica (P1) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Solo 3 datos: Equipo, Destino, Confirmación.
2. Sin datos clínicos innecesarios.
3. Pasa a `EN_USO` y fecha estimada de retorno en +48 hs.""",
        "labels": ["mvp-1", "prioridad-alta", "frontend", "mobile", "backend"],
        "completed_today": False
    },
    {
        "id": "US-06",
        "title": "US-06: Localización Inmediata de Activos en Tiempo Real",
        "body": """### Como
Supervisora de Área o Alejandra,

### Quiero
Ingresar el número de sticker (ej. "14") o escanear el código QR en un buscador rápido,

### Para
Conocer inmediatamente en qué piso, habitación o cama se encuentra operando la máquina y cuánto tiempo lleva allí.

---
**Prioridad:** Alta (P2) | **Estimación:** 2 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Autocompletado con 1 o 2 caracteres.
2. Muestra marca, modelo, serie, servicio propietario, ubicación física y tiempo.
3. Indica si está en taller técnico o sala.""",
        "labels": ["mvp-1", "prioridad-alta", "frontend", "backend"],
        "completed_today": True
    },
    {
        "id": "US-07",
        "title": "US-07: Reingreso de Equipo con Tilde de Bioseguridad LT8 en 1 Clic",
        "body": """### Como
Supervisor que recibe un equipo retornado a su servicio base,

### Quiero
Confirmar la restitución del activo mediante un tilde obligatorio que certifique el cumplimiento del protocolo de desinfección con producto LT8 (5 min de contacto),

### Para
Que el equipo pase inmediatamente a `DISPONIBLE` asegurando la trazabilidad sanitaria sin crear estados intermedios burocráticos que desfasen el sistema.

---
**Prioridad:** Crítica (P1) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 1
**Criterios de Aceptación:**
1. Checkbox obligatorio `[✓] Desinfección con LT8 realizada`.
2. Botón inhabilitado si no está tildado.
3. Pasa inmediatamente a `DISPONIBLE` en servicio propietario con auditoría horaria.""",
        "labels": ["mvp-1", "prioridad-alta", "frontend", "backend"],
        "completed_today": False
    },
    {
        "id": "US-08",
        "title": "US-08: Bloqueo Inmediato por Falla Crítica (Anti-Uso en Sala)",
        "body": """### Como
Supervisor de Área o de Guardia,

### Quiero
Reportar una falla técnica de soporte vital (alarma de presión inoperativa, falla de volumen corriente/tidal mínimo o display averiado),

### Para
Que el sistema bloquee el equipo de inmediato pasándolo a `EN_MANTENIMIENTO` y desvinculándolo de la cama activa, impidiendo que sea conectado por error a otro paciente en una emergencia.

---
**Prioridad:** Crítica (P1) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 2
**Criterios de Aceptación:**
1. Botón de reporte de falla rápida desde ficha de equipo.
2. Pasa a `EN_MANTENIMIENTO` inhabilitando préstamos.
3. Badge rojo destacado en tablero general.""",
        "labels": ["mvp-2", "prioridad-alta", "backend", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-09",
        "title": "US-09: Registro Digital de Salida a Mantenimiento (Libros Descentralizados)",
        "body": """### Como
Supervisor o Encargado de Mantenimiento,

### Quiero
Registrar la entrega de un equipo averiado a reparación especificando si es taller interno o derivación externa, vinculando el número de remito en papel y el folio del Libro de Entrega y Recibo del servicio,

### Para
Eliminar el 'agujero negro' de reparaciones y unificar digitalmente los cuadernos dispersos de UTI, Materno-Infantil y Trasplante.

---
**Prioridad:** Alta (P2) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 2
**Criterios de Aceptación:**
1. Formulario: Falla, Taller (Interno/Externo), Proveedor, Remito/Folio.
2. Orden de mantenimiento abierta en `mantenimientos_equipos`.
3. Descuenta del stock operativo sin baja patrimonial.""",
        "labels": ["mvp-2", "prioridad-alta", "backend", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-10",
        "title": "US-10: Validación Estricta Anti-Intercambio de Serial al Retorno",
        "body": """### Como
Supervisora que recibe un equipo devuelto por el taller técnico,

### Quiero
Que el sistema me exija tipear o escanear obligatoriamente el número de serie de fábrica físico del aparato recibido,

### Para
Compararlo con el serial original de salida y bloquear la recepción si el service devolvió un aparato equivocado.

---
**Prioridad:** Crítica (P1) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 2
**Criterios de Aceptación:**
1. Campo de número de serie obligatorio y sin autocompletar.
2. Si coincide: orden cerrada y retorno confirmado.
3. Si difiere: BLOQUEO estricto de recepción y alerta roja de inconsistencia.""",
        "labels": ["mvp-2", "prioridad-alta", "backend", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-11",
        "title": "US-11: Carga y Asociación de Remitos Oficiales de Service Externo",
        "body": """### Como
Administradora de Equipamiento,

### Quiero
Cargar y asociar el número de remito oficial emitido por el servicio técnico externo a la orden de mantenimiento correspondiente,

### Para
Respaldar legalmente ante los inspectores de Regulación Sanitaria por qué una máquina habilitada no está presente en la clínica.

---
**Prioridad:** Media (P3) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 2
**Criterios de Aceptación:**
1. Adjuntar número oficial de remito comercial.
2. Visualización histórica de reparaciones por serial.""",
        "labels": ["mvp-2", "prioridad-media", "backend"],
        "completed_today": False
    },
    {
        "id": "US-12",
        "title": "US-12: Semáforo Visual de Envejecimiento en Mantenimiento",
        "body": """### Como
Jefa de Equipamiento (Alejandra),

### Quiero
Visualizar una columna con indicador semafórico de permanencia en taller según los días transcurridos desde el envío: Verde (<15 días), Amarillo (15 a 45 días) y Rojo (>45 días),

### Para
Identificar equipos demorados y formalizar reclamos fundados con fecha exacta ante el taller o proveedor.

---
**Prioridad:** Media (P3) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 2
**Criterios de Aceptación:**
1. Cálculo automático de días en taller.
2. Ordenamiento por antigüedad.
3. Alerta destacada para equipos con más de 45 días.""",
        "labels": ["mvp-2", "prioridad-media", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-13",
        "title": "US-13: Alerta Preventiva de Bombas Retenidas (+48 hs en Internación)",
        "body": """### Como
Supervisor General (24/7) y Alejandra,

### Quiero
Visualizar una sección de alertas automáticas destacando aquellas bombas de infusión que lleven más de 48 horas continuas en una habitación de internado general,

### Para
Coordinar activamente el retiro físico de la máquina liberada y devolverla a las terapias intensivas, evitando la retención indebida en pisos.

---
**Prioridad:** Alta (P2) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 3
**Criterios de Aceptación:**
1. Disparo automático tras 48 hs de préstamo.
2. Visualiza número, habitación, horas y botón de coordinación de retiro.
3. Desaparece automáticamente al devolver con LT8.""",
        "labels": ["mvp-3", "prioridad-alta", "frontend", "backend"],
        "completed_today": False
    },
    {
        "id": "US-14",
        "title": "US-14: Gestión y Filtro de Habilitación Ministerial",
        "body": """### Como
Administradora de Equipamiento,

### Quiero
Clasificar y filtrar los equipos según su condición ante el Ministerio (`habilitado_ministerio = 1` vs `0`),

### Para
Monitorear y gestionar la regularización documental de las 17 bombas y 7 respiradores que actualmente circulan en internación fuera de la planilla ministerial.

---
**Prioridad:** Media (P3) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 3
**Criterios de Aceptación:**
1. Filtro formal ministerial vs flota de internación.
2. Reporte comparativo de desfase regulatorio.""",
        "labels": ["mvp-3", "prioridad-media", "frontend", "backend"],
        "completed_today": False
    },
    {
        "id": "US-15",
        "title": "US-15: Exportación de Planilla Oficial para Regulación Sanitaria",
        "body": """### Como
Directivo o Administradora de la Clínica,

### Quiero
Exportar en PDF o Excel con un solo clic el reporte consolidado de equipamiento biomédico estructurado en el formato exacto exigido por la Dirección General de Regulación Sanitaria de Córdoba,

### Para
Presentarlo de forma inmediata ante inspecciones sanitarias de sorpresa, adjuntando automáticamente los números de remito de los equipos ausentes por mantenimiento.

---
**Prioridad:** Alta (P2) | **Estimación:** 5 SP | **MVP Objetivo:** MVP 3
**Criterios de Aceptación:**
1. Estructura exacta requerida por el Ministerio de Salud de Córdoba.
2. Adjunta remitos de equipos ausentes por service.
3. Exportación en 1 clic.""",
        "labels": ["mvp-3", "prioridad-alta", "backend", "frontend"],
        "completed_today": False
    },
    {
        "id": "US-16",
        "title": "US-16: Auditoría Completa e Historial Inmutable de Movimientos",
        "body": """### Como
Administradora o Auditor del Comité de Control de Infecciones,

### Quiero
Consultar el registro histórico inmutable de traslados, préstamos, desinfecciones y cambios de servicio de cualquier máquina,

### Para
Contar con trazabilidad retrospectiva ante investigaciones clínicas, extravíos o auditorías internas.

---
**Prioridad:** Media (P3) | **Estimación:** 3 SP | **MVP Objetivo:** MVP 3
**Criterios de Aceptación:**
1. Timeline completa de cada activo: fechas, orígenes, destinos y usuarios.
2. Constancia fehaciente de desinfección con LT8.
3. Registros de solo lectura inmutables.""",
        "labels": ["mvp-3", "prioridad-media", "backend", "frontend"],
        "completed_today": False
    }
]

def main():
    token = get_github_token()
    repo = "sciarramartin/PROYECTO-PPS-GESTION-DE-EQUIPAMIENTO"
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Antigravity-Agent',
        'Content-Type': 'application/json'
    }

    print(f"Sincronizando 16 User Stories como Issues en {repo}...")
    
    # Check existing issues
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}/issues?state=all&per_page=100", headers=headers)
    existing_titles = set()
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            for item in data:
                existing_titles.add(item['title'].split(':')[0].strip())
    except Exception as e:
        print(f"Aviso al listar issues existentes: {e}")

    created_count = 0
    closed_count = 0

    for us in USER_STORIES:
        us_prefix = us["id"]
        if us_prefix in existing_titles:
            print(f"- {us_prefix} ya existe en el repositorio.")
            continue

        payload = {
            "title": us["title"],
            "body": us["body"],
            "labels": us["labels"]
        }
        req = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/issues",
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        try:
            with urllib.request.urlopen(req) as resp:
                issue_data = json.loads(resp.read().decode())
                issue_number = issue_data['number']
                created_count += 1
                print(f"✓ Creada #{issue_number}: {us['title']}")

                # If completed today, close it with a resolution note
                if us["completed_today"]:
                    close_payload = {
                        "state": "closed",
                        "state_reason": "completed"
                    }
                    close_req = urllib.request.Request(
                        f"https://api.github.com/repos/{repo}/issues/{issue_number}",
                        data=json.dumps(close_payload).encode('utf-8'),
                        headers=headers,
                        method='PATCH'
                    )
                    with urllib.request.urlopen(close_req) as close_resp:
                        print(f"  -> Cerrada #{issue_number} (Implementada hoy en branch develop)")
                        closed_count += 1
                
                # Small sleep to respect rate limits
                time.sleep(0.5)

        except urllib.error.HTTPError as he:
            print(f"Error HTTP creando {us_prefix}: {he.code} - {he.read().decode()}")
        except Exception as ex:
            print(f"Error creando {us_prefix}: {ex}")

    print(f"\nResumen final: {created_count} creadas, {closed_count} cerradas por estar completadas hoy.")

if __name__ == '__main__':
    main()
