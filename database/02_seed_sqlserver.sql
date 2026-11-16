-- ==============================================================================
-- SEED DATA DE EQUIPAMIENTO REAL - CLÍNICA PRIVADA VÉLEZ SARSFIELD
-- Script: 02_seed_sqlserver.sql
-- ==============================================================================

USE [selfcontrol];
GO

-- 1. SUCURSALES
SET IDENTITY_INSERT [dbo].[sucursales] OFF;
IF NOT EXISTS (SELECT 1 FROM [dbo].[sucursales] WHERE [id_sucursal] = 1)
    INSERT INTO [dbo].[sucursales] ([id_sucursal], [nombre], [direccion], [internados])
    VALUES (1, 'Sede Central', 'Naciones Unidas 984, Córdoba', 1);

IF NOT EXISTS (SELECT 1 FROM [dbo].[sucursales] WHERE [id_sucursal] = 2)
    INSERT INTO [dbo].[sucursales] ([id_sucursal], [nombre], [direccion], [internados])
    VALUES (2, 'Sede Norte', 'Av. Rafael Núñez 5200, Córdoba', 0);

IF NOT EXISTS (SELECT 1 FROM [dbo].[sucursales] WHERE [id_sucursal] = 3)
    INSERT INTO [dbo].[sucursales] ([id_sucursal], [nombre], [direccion], [internados])
    VALUES (3, 'Sede Ruta 20', 'Fuerza Aérea Argentina 2800, Córdoba', 0);
GO

-- 2. DEPÓSITOS / SERVICIOS CLÍNICOS
SET IDENTITY_INSERT [dbo].[depositos] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 1)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (1, 'UTI Adultos');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 2)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (2, 'Terapia Pediátrica (UTIP)');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 3)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (3, 'Neonatología (UTIN)');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 4)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (4, 'Quirófanos Centrales');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 5)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (5, 'Guardia Central y Shockroom');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 6)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (6, 'Taller / Mantenimiento');
IF NOT EXISTS (SELECT 1 FROM [dbo].[depositos] WHERE [id_depositos] = 7)
    INSERT INTO [dbo].[depositos] ([id_depositos], [nombre]) VALUES (7, 'Oncología y Quimioterapia');
SET IDENTITY_INSERT [dbo].[depositos] OFF;
GO

-- 3. CATÁLOGO MAESTRO DE ARTÍCULOS
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 1001)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (1001, 'BOMBA DE INFUSION CONTINUA LEXX', 'S');
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 1002)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (1002, 'BOMBA DE INFUSION VOLUMETRICA MINDRAY', 'S');
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 2001)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (2001, 'RESPIRADOR VOLUMETRICO NEUMOVENT GRAPH TS', 'S');
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 2002)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (2002, 'RESPIRADOR VOLUMETRICO LEISTUNG LUFT 3', 'S');
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 3001)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (3001, 'MONITOR MULTIPARAMETRICO MINDRAY UMEC12', 'S');
IF NOT EXISTS (SELECT 1 FROM [dbo].[articulos] WHERE [articulo] = 4001)
    INSERT INTO [dbo].[articulos] ([articulo], [nombre], [stock]) VALUES (4001, 'CARDIODESFIBRILADOR BIFASICO NIHON KOHDEN', 'S');
GO

-- 4. USUARIOS INSTITUCIONALES
SET IDENTITY_INSERT [dbo].[usuarios] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[usuarios] WHERE [id_usuarios] = 1)
    INSERT INTO [dbo].[usuarios] ([id_usuarios], [login_name], [nombre], [email], [activo], [rol])
    VALUES (1, 'alejandra', 'Alejandra - Gestión Equipamiento', 'alejandra.equipos@cpvs.com.ar', 'S', 'ADMIN');

IF NOT EXISTS (SELECT 1 FROM [dbo].[usuarios] WHERE [id_usuarios] = 2)
    INSERT INTO [dbo].[usuarios] ([id_usuarios], [login_name], [nombre], [email], [activo], [rol])
    VALUES (2, 'guardia24', 'Supervisor General de Guardia', 'supervision.guardia@cpvs.com.ar', 'S', 'SUPERVISOR_GENERAL');

IF NOT EXISTS (SELECT 1 FROM [dbo].[usuarios] WHERE [id_usuarios] = 3)
    INSERT INTO [dbo].[usuarios] ([id_usuarios], [login_name], [nombre], [email], [activo], [rol])
    VALUES (3, 'pbassi', 'Lic. Pablo Bassi - Sistemas', 'pablo.bassi@cpvs.com.ar', 'S', 'TECNICO');

IF NOT EXISTS (SELECT 1 FROM [dbo].[usuarios] WHERE [id_usuarios] = 4)
    INSERT INTO [dbo].[usuarios] ([id_usuarios], [login_name], [nombre], [email], [activo], [rol])
    VALUES (4, 'sup_uti', 'Lic. Enfermería - Jefe UTI', 'uti.enfermeria@cpvs.com.ar', 'S', 'SUPERVISOR_AREA');
SET IDENTITY_INSERT [dbo].[usuarios] OFF;
GO

-- 5. SECTORES Y HABITACIONES
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sector] WHERE [sector] = 101)
    INSERT INTO [dbo].[Sector] ([sector], [nombre], [id_sucursal]) VALUES (101, 'Piso 1 - Internación General', 1);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sector] WHERE [sector] = 201)
    INSERT INTO [dbo].[Sector] ([sector], [nombre], [id_sucursal]) VALUES (201, 'Piso 2 - Quirúrgica', 1);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sector] WHERE [sector] = 301)
    INSERT INTO [dbo].[Sector] ([sector], [nombre], [id_sucursal]) VALUES (301, 'Piso 3 - Especialidades', 1);

IF NOT EXISTS (SELECT 1 FROM [dbo].[tipo_habitacion] WHERE [tipo_habitacion] = 1)
    INSERT INTO [dbo].[tipo_habitacion] ([tipo_habitacion], [nombre]) VALUES (1, 'Habitación Doble Estándar');

-- Insertar camas representativas
MERGE [dbo].[habitaciones] AS Target
USING (VALUES 
    (101, 'A', 1, 101, 'Piso 1 - Hab. 101 Cama A'),
    (101, 'B', 1, 101, 'Piso 1 - Hab. 101 Cama B'),
    (102, 'A', 1, 101, 'Piso 1 - Hab. 102 Cama A'),
    (102, 'B', 1, 101, 'Piso 1 - Hab. 102 Cama B'),
    (201, 'A', 1, 201, 'Piso 2 - Hab. 201 Cama A'),
    (201, 'B', 1, 201, 'Piso 2 - Hab. 201 Cama B'),
    (205, 'A', 1, 201, 'Piso 2 - Hab. 205 Cama A'),
    (214, 'A', 1, 201, 'Piso 2 - Hab. 214 Cama A'),
    (301, 'A', 1, 301, 'Piso 3 - Hab. 301 Cama A'),
    (305, 'B', 1, 301, 'Piso 3 - Hab. 305 Cama B')
) AS Source ([nro_habitacion], [cama], [tipo_habitacion], [sector], [ubicacion])
ON Target.[nro_habitacion] = Source.[nro_habitacion] AND Target.[cama] = Source.[cama] AND Target.[sector] = Source.[sector]
WHEN NOT MATCHED THEN
    INSERT ([nro_habitacion], [cama], [tipo_habitacion], [sector], [ubicacion], [baja])
    VALUES (Source.[nro_habitacion], Source.[cama], Source.[tipo_habitacion], Source.[sector], Source.[ubicacion], NULL);
GO

-- 6. POBLAR TABLA UNIFICADORA UBICACIONES
-- Primero los depósitos/servicios
INSERT INTO [dbo].[ubicaciones] ([id_sucursal], [nombre], [tipo_ubicacion], [sector_piso], [id_deposito_legacy], [activo])
SELECT 
    1, RTRIM([nombre]), 
    CASE WHEN [id_depositos] = 6 THEN 'TALLER' ELSE 'SERVICIO' END,
    'Servicio Central', [id_depositos], 1
FROM [dbo].[depositos] d
WHERE NOT EXISTS (SELECT 1 FROM [dbo].[ubicaciones] u WHERE u.[id_deposito_legacy] = d.[id_depositos]);

-- Luego las camas activas sincronizadas desde la vista
INSERT INTO [dbo].[ubicaciones] ([id_sucursal], [nombre], [tipo_ubicacion], [sector_piso], [nro_habitacion_legacy], [cama_legacy], [sector_legacy], [activo])
SELECT 
    v.[id_sucursal], v.[nombre_ubicacion], v.[tipo_ubicacion], v.[sector_piso],
    v.[nro_habitacion_legacy], v.[cama_legacy], v.[sector_legacy], 1
FROM [dbo].[vw_sincronizacion_camas] v
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[ubicaciones] u 
    WHERE u.[nro_habitacion_legacy] = v.[nro_habitacion_legacy] 
      AND u.[cama_legacy] = v.[cama_legacy] 
      AND u.[sector_legacy] = v.[sector_legacy]
);
GO
