import sqlite3
import os

os.makedirs('database', exist_ok=True)
db_path = 'database/clinica_biomedico.sqlite'
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Tablas legadas emuladas en SQLite
cur.executescript('''
CREATE TABLE sucursales (
    id_sucursal INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT,
    internados INTEGER DEFAULT 0,
    baja TEXT
);

CREATE TABLE depositos (
    id_depositos INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE Sector (
    sector INTEGER PRIMARY KEY,
    nombre TEXT,
    id_sucursal INTEGER REFERENCES sucursales(id_sucursal)
);

CREATE TABLE tipo_habitacion (
    tipo_habitacion INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
);

CREATE TABLE habitaciones (
    nro_habitacion INTEGER NOT NULL,
    cama TEXT NOT NULL,
    tipo_habitacion INTEGER REFERENCES tipo_habitacion(tipo_habitacion),
    sector INTEGER REFERENCES Sector(sector),
    ubicacion TEXT,
    descripcion TEXT,
    baja TEXT,
    oxigeno TEXT,
    PRIMARY KEY (nro_habitacion, cama, sector)
);

CREATE TABLE articulos (
    articulo INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    stock TEXT DEFAULT 'S',
    baja TEXT
);

CREATE TABLE usuarios (
    id_usuarios INTEGER PRIMARY KEY AUTOINCREMENT,
    login_name TEXT NOT NULL,
    clave TEXT,
    nombre TEXT,
    email TEXT,
    activo TEXT DEFAULT 'S',
    rol TEXT DEFAULT 'SUPERVISOR_AREA'
);

-- 2. Capa de Trazabilidad y Bioseguridad
CREATE TABLE ubicaciones (
    id_ubicacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_sucursal INTEGER NOT NULL REFERENCES sucursales(id_sucursal),
    nombre TEXT NOT NULL,
    tipo_ubicacion TEXT NOT NULL CHECK (tipo_ubicacion IN ('HABITACION', 'DEPOSITO', 'SERVICIO', 'TALLER')),
    sector_piso TEXT,
    id_deposito_legacy INTEGER REFERENCES depositos(id_depositos),
    nro_habitacion_legacy INTEGER,
    cama_legacy TEXT,
    sector_legacy INTEGER,
    activo INTEGER DEFAULT 1
);

CREATE TABLE equipos_biomedicos (
    id_equipo INTEGER PRIMARY KEY AUTOINCREMENT,
    articulo_id INTEGER NOT NULL REFERENCES articulos(articulo),
    numero_serie TEXT NOT NULL UNIQUE,
    numero_sticker TEXT,
    codigo_qr TEXT NOT NULL UNIQUE,
    estado_operativo TEXT NOT NULL CHECK (estado_operativo IN ('DISPONIBLE', 'EN_USO', 'EN_MANTENIMIENTO', 'DE_BAJA')) DEFAULT 'DISPONIBLE',
    deposito_propietario_id INTEGER NOT NULL REFERENCES depositos(id_depositos),
    ubicacion_actual_id INTEGER NOT NULL REFERENCES ubicaciones(id_ubicacion),
    habilitado_ministerio INTEGER NOT NULL DEFAULT 1,
    es_propio INTEGER NOT NULL DEFAULT 1,
    propietario_tercero TEXT,
    cuit_tercero TEXT,
    creado_el TEXT DEFAULT CURRENT_TIMESTAMP,
    actualizado_el TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimientos_equipos (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_equipo INTEGER NOT NULL REFERENCES equipos_biomedicos(id_equipo),
    ubicacion_origen_id INTEGER NOT NULL REFERENCES ubicaciones(id_ubicacion),
    ubicacion_destino_id INTEGER NOT NULL REFERENCES ubicaciones(id_ubicacion),
    fecha_salida TEXT DEFAULT CURRENT_TIMESTAMP,
    fecha_retorno_estimada TEXT,
    fecha_retorno_real TEXT,
    desinfeccion_realizada INTEGER DEFAULT 0,
    usuario_envia_id INTEGER REFERENCES usuarios(id_usuarios),
    usuario_recibe_id INTEGER REFERENCES usuarios(id_usuarios),
    estado_movimiento TEXT NOT NULL CHECK (estado_movimiento IN ('EN_CURSO', 'DEVUELTO', 'RECLAMADO')) DEFAULT 'EN_CURSO',
    observaciones TEXT
);

CREATE TABLE mantenimientos_equipos (
    id_mantenimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_equipo INTEGER NOT NULL REFERENCES equipos_biomedicos(id_equipo),
    fecha_envio TEXT DEFAULT CURRENT_TIMESTAMP,
    falla_declarada TEXT NOT NULL,
    tipo_taller TEXT NOT NULL CHECK (tipo_taller IN ('INTERNO', 'EXTERNO')),
    proveedor_externo TEXT,
    numero_remito_externo TEXT,
    numero_acta_papel TEXT,
    fecha_devolucion TEXT,
    numero_serie_devuelto TEXT,
    usuario_entrego_id INTEGER NOT NULL REFERENCES usuarios(id_usuarios),
    usuario_recibio_id INTEGER REFERENCES usuarios(id_usuarios),
    estado_orden TEXT NOT NULL CHECK (estado_orden IN ('ABIERTA', 'EN_REPARACION', 'CERRADA')) DEFAULT 'ABIERTA'
);

CREATE VIEW vw_sincronizacion_camas AS
SELECT 
    s.id_sucursal,
    sec.nombre || ' - Hab. ' || h.nro_habitacion || ' Cama ' || h.cama AS nombre_ubicacion,
    'HABITACION' AS tipo_ubicacion,
    sec.nombre AS sector_piso,
    h.nro_habitacion AS nro_habitacion_legacy,
    h.cama AS cama_legacy,
    h.sector AS sector_legacy
FROM habitaciones h
INNER JOIN Sector sec ON h.sector = sec.sector
LEFT JOIN sucursales s ON sec.id_sucursal = s.id_sucursal
WHERE h.baja IS NULL;
''')

# 3. Poblar datos maestros
cur.executemany('INSERT INTO sucursales VALUES (?, ?, ?, ?, ?)', [
    (1, 'Sede Central', 'Naciones Unidas 984, Córdoba', 1, None),
    (2, 'Sede Norte', 'Av. Rafael Núñez 5200, Córdoba', 0, None),
    (3, 'Sede Ruta 20', 'Fuerza Aérea Argentina 2800, Córdoba', 0, None),
])

cur.executemany('INSERT INTO depositos (id_depositos, nombre) VALUES (?, ?)', [
    (1, 'UTI Adultos'),
    (2, 'Terapia Pediátrica (UTIP)'),
    (3, 'Neonatología (UTIN)'),
    (4, 'Quirófanos Centrales'),
    (5, 'Guardia Central y Shockroom'),
    (6, 'Taller Bioingeniería / Mantenimiento'),
    (7, 'Oncología y Quimioterapia'),
])

cur.executemany('INSERT INTO articulos VALUES (?, ?, ?, ?)', [
    (1001, 'Bomba de Infusión Continua LEXX', 'S', None),
    (1002, 'Bomba de Infusión Volumétrica Mindray BeneFusion', 'S', None),
    (2001, 'Respirador Volumétrico Neumovent Graph TS', 'S', None),
    (2002, 'Respirador Volumétrico Leistung Luft 3', 'S', None),
    (3001, 'Monitor Multiparamétrico Mindray uMEC12', 'S', None),
    (4001, 'Cardiodesfibrilador Nihon Kohden CardioLife', 'S', None),
])

cur.executemany('INSERT INTO usuarios (id_usuarios, login_name, clave, nombre, email, activo, rol) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    (1, 'alejandra', '1234', 'Alejandra - Gestión Equipamiento', 'alejandra.equipos@cpvs.com.ar', 'S', 'ADMIN'),
    (2, 'guardia24', '1234', 'Supervisor General de Guardia', 'supervision.guardia@cpvs.com.ar', 'S', 'SUPERVISOR_GENERAL'),
    (3, 'pbassi', '1234', 'Lic. Pablo Bassi - Sistemas', 'pablo.bassi@cpvs.com.ar', 'S', 'TECNICO'),
    (4, 'sup_uti', '1234', 'Lic. Enfermería - Jefe UTI', 'uti.enfermeria@cpvs.com.ar', 'S', 'SUPERVISOR_AREA'),
])

cur.executemany('INSERT INTO Sector VALUES (?, ?, ?)', [
    (101, 'Piso 1 - Internación General', 1),
    (201, 'Piso 2 - Quirúrgica', 1),
    (301, 'Piso 3 - Cuidados Especiales', 1),
])

cur.execute('INSERT INTO tipo_habitacion VALUES (?, ?)', (1, 'Habitación Doble Estándar'))

# Habitaciones de internación
camas = [
    (101, 'A', 1, 101, 'Piso 1 - Hab. 101 Cama A', 'Ala Médica', None, 'S'),
    (101, 'B', 1, 101, 'Piso 1 - Hab. 101 Cama B', 'Ala Médica', None, 'S'),
    (102, 'A', 1, 101, 'Piso 1 - Hab. 102 Cama A', 'Ala Médica', None, 'S'),
    (102, 'B', 1, 101, 'Piso 1 - Hab. 102 Cama B', 'Ala Médica', None, 'S'),
    (201, 'A', 1, 201, 'Piso 2 - Hab. 201 Cama A', 'Ala Quirúrgica', None, 'S'),
    (201, 'B', 1, 201, 'Piso 2 - Hab. 201 Cama B', 'Ala Quirúrgica', None, 'S'),
    (205, 'A', 1, 201, 'Piso 2 - Hab. 205 Cama A', 'Ala Quirúrgica', None, 'S'),
    (214, 'A', 1, 201, 'Piso 2 - Hab. 214 Cama A', 'Ala Quirúrgica', None, 'S'),
    (301, 'A', 1, 301, 'Piso 3 - Hab. 301 Cama A', 'Especialidades', None, 'S'),
    (305, 'B', 1, 301, 'Piso 3 - Hab. 305 Cama B', 'Especialidades', None, 'S'),
]
cur.executemany('INSERT INTO habitaciones VALUES (?, ?, ?, ?, ?, ?, ?, ?)', camas)

# 4. Poblar Ubicaciones Unificadas
# Servicios/Depósitos (id_ubicacion 1 al 7)
servicios_ubic = [
    (1, 'UTI Adultos (Piso 1)', 'SERVICIO', 'Planta 1', 1),
    (2, 'Terapia Pediátrica UTIP', 'SERVICIO', 'Planta 2', 2),
    (3, 'Neonatología UTIN', 'SERVICIO', 'Planta 2', 3),
    (4, 'Quirófanos Centrales', 'SERVICIO', 'Subsuelo', 4),
    (5, 'Guardia Central y Shockroom', 'SERVICIO', 'Planta Baja', 5),
    (6, 'Taller Bioingeniería / Service', 'TALLER', 'Subsuelo Técnico', 6),
    (7, 'Oncología y Quimioterapia', 'SERVICIO', 'Planta 3', 7),
]
for su in servicios_ubic:
    cur.execute('''
        INSERT INTO ubicaciones (id_sucursal, nombre, tipo_ubicacion, sector_piso, id_deposito_legacy, activo)
        VALUES (1, ?, ?, ?, ?, 1)
    ''', (su[1], su[2], su[3], su[4]))

# Camas sincronizadas (id_ubicacion 8 al 17)
for c in camas:
    nombre_ub = f"{c[4]} ({c[5]})"
    cur.execute('''
        INSERT INTO ubicaciones (id_sucursal, nombre, tipo_ubicacion, sector_piso, nro_habitacion_legacy, cama_legacy, sector_legacy, activo)
        VALUES (1, ?, 'HABITACION', ?, ?, ?, ?, 1)
    ''', (nombre_ub, c[5], c[0], c[1], c[3]))

# 5. Poblar las 42 BOMBAS DE INFUSIÓN
# 32 Bombas Lexx numeradas de 1 al 32
for i in range(1, 33):
    st_num = str(i)
    serial = f"LX-2024-{i:03d}"
    qr_token = f"QR-LEXX-{i:03d}-CPVS"
    
    if i in [1, 2, 3, 4, 5, 6, 7, 8]:
        dep_prop = 1
        ub_act = 1
        estado = 'DISPONIBLE'
    elif i in [9, 10, 11]:
        dep_prop = 1
        ub_act = 7 + (i - 8)
        estado = 'EN_USO'
    elif i == 12:
        dep_prop = 1
        ub_act = 6
        estado = 'EN_MANTENIMIENTO'
    elif i in [13, 14, 15, 16, 17, 18]:
        dep_prop = 2
        ub_act = 2
        estado = 'DISPONIBLE'
    elif i in [19, 20, 21]:
        dep_prop = 2
        ub_act = 11 + (i - 19)
        estado = 'EN_USO'
    elif i == 22:
        dep_prop = 2
        ub_act = 6
        estado = 'EN_MANTENIMIENTO'
    elif i in [23, 24, 25, 26, 27, 28, 29]:
        dep_prop = 3
        ub_act = 3
        estado = 'DISPONIBLE'
    else:
        dep_prop = 3
        ub_act = 14 + (i - 30)
        estado = 'EN_USO'
        
    cur.execute('''
        INSERT INTO equipos_biomedicos 
        (articulo_id, numero_serie, numero_sticker, codigo_qr, estado_operativo, deposito_propietario_id, ubicacion_actual_id, habilitado_ministerio, es_propio)
        VALUES (1001, ?, ?, ?, ?, ?, ?, 1, 1)
    ''', (serial, st_num, qr_token, estado, dep_prop, ub_act))

# 10 Bombas Mindray (secundarias, stickers 33 al 42)
for i in range(33, 43):
    st_num = str(i)
    serial = f"MR-BF-50{i:02d}"
    qr_token = f"QR-MINDRAY-{i:03d}-CPVS"
    dep_prop = 4 if i <= 36 else 5
    ub_act = dep_prop
    estado = 'DISPONIBLE' if i != 40 else 'EN_USO'
    if estado == 'EN_USO':
        ub_act = 17
    cur.execute('''
        INSERT INTO equipos_biomedicos 
        (articulo_id, numero_serie, numero_sticker, codigo_qr, estado_operativo, deposito_propietario_id, ubicacion_actual_id, habilitado_ministerio, es_propio)
        VALUES (1002, ?, ?, ?, ?, ?, ?, 1, 1)
    ''', (serial, st_num, qr_token, estado, dep_prop, ub_act))

# 6. Poblar los 22 RESPIRADORES VOLUMÉTRICOS
respiradores = [
    (2001, 'NG-TS-2025', 'R-01', 'QR-RESP-001', 'DISPONIBLE', 1, 1),
    (2001, 'NG-TS-1617', 'R-02', 'QR-RESP-002', 'DISPONIBLE', 1, 1),
    (2001, 'NG-TS-1044', 'R-03', 'QR-RESP-003', 'EN_USO', 1, 8),
    (2001, 'NG-TS-1088', 'R-04', 'QR-RESP-004', 'DISPONIBLE', 1, 1),
    (2001, 'NG-TS-2100', 'R-05', 'QR-RESP-005', 'EN_MANTENIMIENTO', 1, 6),
    (2001, 'NG-TS-2150', 'R-06', 'QR-RESP-006', 'DISPONIBLE', 2, 2),
    (2001, 'NG-TS-2180', 'R-07', 'QR-RESP-007', 'DISPONIBLE', 2, 2),
    (2001, 'NG-TS-2200', 'R-08', 'QR-RESP-008', 'EN_USO', 2, 11),
    (2001, 'NG-TS-3010', 'R-09', 'QR-RESP-009', 'DISPONIBLE', 3, 3),
    (2001, 'NG-TS-3020', 'R-10', 'QR-RESP-010', 'DISPONIBLE', 3, 3),
    (2001, 'NG-TS-3030', 'R-11', 'QR-RESP-011', 'DISPONIBLE', 4, 4),
    (2001, 'NG-NET-003', 'R-12', 'QR-RESP-012', 'EN_USO', 3, 3),
    
    (2002, 'LF-0982', 'R-13', 'QR-RESP-013', 'DISPONIBLE', 1, 1),
    (2002, 'LF-1104', 'R-14', 'QR-RESP-014', 'DISPONIBLE', 1, 1),
    (2002, 'LF-1150', 'R-15', 'QR-RESP-015', 'EN_USO', 1, 9),
    (2002, 'LF-1200', 'R-16', 'QR-RESP-016', 'DISPONIBLE', 2, 2),
    (2002, 'LF-1250', 'R-17', 'QR-RESP-017', 'DISPONIBLE', 4, 4),
    (2002, 'LF-1300', 'R-18', 'QR-RESP-018', 'DISPONIBLE', 4, 4),
    (2002, 'LF-1350', 'R-19', 'QR-RESP-019', 'DISPONIBLE', 5, 5),
    (2002, 'LF-1400', 'R-20', 'QR-RESP-020', 'EN_MANTENIMIENTO', 5, 6),
    (2002, 'LF-1450', 'R-21', 'QR-RESP-021', 'DISPONIBLE', 5, 5),
    (2002, 'LF-1500', 'R-22', 'QR-RESP-022', 'DISPONIBLE', 7, 7),
]

for r in respiradores:
    cur.execute('''
        INSERT INTO equipos_biomedicos 
        (articulo_id, numero_serie, numero_sticker, codigo_qr, estado_operativo, deposito_propietario_id, ubicacion_actual_id, habilitado_ministerio, es_propio)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
    ''', r)

# 7. Movimientos activos para los equipos EN_USO
cur.execute("SELECT id_equipo, deposito_propietario_id, ubicacion_actual_id FROM equipos_biomedicos WHERE estado_operativo = 'EN_USO'")
equipos_en_uso = cur.fetchall()

for eq_id, dep_prop, ub_act in equipos_en_uso:
    cur.execute('''
        INSERT INTO movimientos_equipos 
        (id_equipo, ubicacion_origen_id, ubicacion_destino_id, fecha_salida, fecha_retorno_estimada, desinfeccion_realizada, usuario_envia_id, estado_movimiento, observaciones)
        VALUES (?, ?, ?, datetime('now', '-18 hours'), datetime('now', '+30 hours'), 0, 2, 'EN_CURSO', 'Préstamo activo de guardia')
    ''', (eq_id, dep_prop, ub_act))

# 8. Mantenimientos activos para los equipos EN_MANTENIMIENTO
cur.execute("SELECT id_equipo FROM equipos_biomedicos WHERE estado_operativo = 'EN_MANTENIMIENTO'")
equipos_en_taller = cur.fetchall()

fallas = [
    'Error en sensor de flujo y calibración de volumen',
    'Falla en sensor de presión - alarma no operativa',
    'Batería interna agotada - requiere recambio de celdas'
]
for idx, (eq_id,) in enumerate(equipos_en_taller):
    falla = fallas[idx % len(fallas)]
    cur.execute('''
        INSERT INTO mantenimientos_equipos
        (id_equipo, fecha_envio, falla_declarada, tipo_taller, proveedor_externo, numero_remito_externo, numero_acta_papel, usuario_entrego_id, estado_orden)
        VALUES (?, datetime('now', '-5 days'), ?, 'INTERNO', 'Taller Bioingeniería CPVS', 'REM-2026-089', 'Folio 42 Libro UTI', 3, 'EN_REPARACION')
    ''', (eq_id, falla))

conn.commit()

# Verificaciones
cur.execute('SELECT COUNT(*) FROM equipos_biomedicos WHERE articulo_id IN (1001, 1002)')
total_bombas = cur.fetchone()[0]

cur.execute('SELECT COUNT(*) FROM equipos_biomedicos WHERE articulo_id IN (2001, 2002)')
total_resp = cur.fetchone()[0]

cur.execute('SELECT COUNT(*) FROM ubicaciones')
total_ubic = cur.fetchone()[0]

print(f'BD SQLite creada exitosamente en: {db_path}')
print(f'Total Bombas de Infusión: {total_bombas} (Meta: 42)')
print(f'Total Respiradores: {total_resp} (Meta: 22)')
print(f'Total Ubicaciones Unificadas: {total_ubic} (7 servicios + 10 camas)')

conn.close()
