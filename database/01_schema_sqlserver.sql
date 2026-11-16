-- ==============================================================================
-- SISTEMA DE GESTIÓN, TRAZABILIDAD Y BIOSEGURIDAD DE EQUIPAMIENTO BIOMÉDICO
-- Organización: Servicios Médicos S.R.L. (Clínica Privada Vélez Sarsfield)
-- Motor: Microsoft SQL Server (Transact-SQL)
-- Script: 01_schema_sqlserver.sql
-- ==============================================================================

USE [selfcontrol];
GO

-- 1. TABLAS LEGADAS DE LA CLÍNICA (Si no existen en el entorno de desarrollo)
IF OBJECT_ID(N'dbo.sucursales', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[sucursales](
        [id_sucursal] [numeric](18, 0) NOT NULL,
        [nombre] [nchar](50) NOT NULL,
        [direccion] [varchar](100) NULL,
        [ambulatorio] [numeric](1, 0) NULL,
        [internados] [numeric](1, 0) NULL,
        [sede] [numeric](2, 0) NULL,
        [baja] [datetime] NULL,
        [comedor] [bit] NULL,
        CONSTRAINT [PK_sucursales] PRIMARY KEY CLUSTERED ([id_sucursal] ASC)
    );
END
GO

IF OBJECT_ID(N'dbo.depositos', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[depositos](
        [id_depositos] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
        [nombre] [char](50) NOT NULL,
        CONSTRAINT [PK_depositos] PRIMARY KEY CLUSTERED ([id_depositos] ASC)
    );
END
GO

IF OBJECT_ID(N'dbo.Sector', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Sector](
        [sector] [numeric](3, 0) NOT NULL,
        [nombre] [char](50) NULL,
        [nombre_reducido] [char](25) NULL,
        [clinica] [char](10) NULL,
        [id_sucursal] [numeric](18, 0) NULL,
        [zona_] [varchar](20) NULL,
        [grupo] [numeric](2, 0) NULL,
        CONSTRAINT [PK_SECTOR] PRIMARY KEY CLUSTERED ([sector] ASC)
    );
END
GO

IF OBJECT_ID(N'dbo.tipo_habitacion', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[tipo_habitacion](
        [tipo_habitacion] [numeric](2, 0) NOT NULL,
        [nombre] [char](50) NOT NULL,
        CONSTRAINT [PK_TIPO_HABITACION] PRIMARY KEY CLUSTERED ([tipo_habitacion] ASC)
    );
END
GO

IF OBJECT_ID(N'dbo.habitaciones', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[habitaciones](
        [nro_habitacion] [numeric](4, 0) NOT NULL,
        [cama] [char](1) NOT NULL,
        [tipo_habitacion] [numeric](2, 0) NOT NULL,
        [sector] [numeric](3, 0) NOT NULL,
        [ubicacion] [char](150) NULL,
        [descripcion] [char](150) NULL,
        [baja] [datetime] NULL,
        [oxigeno] [char](1) NULL,
        CONSTRAINT [PK_HABITACIONES] PRIMARY KEY CLUSTERED ([nro_habitacion] ASC, [cama] ASC, [sector] ASC),
        CONSTRAINT [FK_HABITACI_SECTOR] FOREIGN KEY ([sector]) REFERENCES [dbo].[Sector] ([sector]),
        CONSTRAINT [FK_HABITACI_TIPO] FOREIGN KEY ([tipo_habitacion]) REFERENCES [dbo].[tipo_habitacion] ([tipo_habitacion])
    );
END
GO

IF OBJECT_ID(N'dbo.articulos', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[articulos](
        [articulo] [numeric](9, 0) NOT NULL,
        [nombre] [char](80) NOT NULL,
        [stock] [char](1) NOT NULL DEFAULT 'S',
        [baja] [datetime] NULL,
        CONSTRAINT [PK_articulos] PRIMARY KEY CLUSTERED ([articulo] ASC)
    );
END
GO

IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[usuarios](
        [id_usuarios] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
        [login_name] [char](15) NOT NULL,
        [clave] [char](10) NULL,
        [nombre] [char](50) NULL,
        [email] [char](50) NULL,
        [activo] [char](1) NULL DEFAULT 'S',
        [rol] [varchar](30) NULL DEFAULT 'SUPERVISOR_AREA',
        CONSTRAINT [PK_USUARIOS] PRIMARY KEY CLUSTERED ([id_usuarios] ASC)
    );
END
GO

-- 2. CAPA DE TRAZABILIDAD Y BIOSEGURIDAD (NUEVAS ENTIDADES NO INVASIVAS)

-- Tabla Unificadora de Destinos (Servicios y Camas)
IF OBJECT_ID(N'dbo.ubicaciones', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ubicaciones](
        [id_ubicacion] [int] IDENTITY(1,1) NOT NULL,
        [id_sucursal] [numeric](18, 0) NOT NULL,
        [nombre] [varchar](100) NOT NULL,
        [tipo_ubicacion] [varchar](20) NOT NULL,
        [sector_piso] [varchar](50) NULL,
        [id_deposito_legacy] [numeric](18, 0) NULL,
        [nro_habitacion_legacy] [numeric](4, 0) NULL,
        [cama_legacy] [char](1) NULL,
        [sector_legacy] [numeric](3, 0) NULL,
        [activo] [bit] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_ubicaciones] PRIMARY KEY CLUSTERED ([id_ubicacion] ASC),
        CONSTRAINT [CK_ubicaciones_tipo] CHECK ([tipo_ubicacion] IN ('HABITACION', 'DEPOSITO', 'SERVICIO', 'TALLER')),
        CONSTRAINT [FK_ubicaciones_sucursal] FOREIGN KEY ([id_sucursal]) REFERENCES [dbo].[sucursales] ([id_sucursal])
    );
    CREATE NONCLUSTERED INDEX [IX_ubicaciones_tipo] ON [dbo].[ubicaciones] ([tipo_ubicacion], [activo]);
END
GO

-- Maestro de Equipos Serializados con Identificación Dual
IF OBJECT_ID(N'dbo.equipos_biomedicos', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[equipos_biomedicos](
        [id_equipo] [int] IDENTITY(1,1) NOT NULL,
        [articulo_id] [numeric](9, 0) NOT NULL,
        [numero_serie] [varchar](50) NOT NULL,
        [numero_sticker] [varchar](20) NULL,
        [codigo_qr] [varchar](64) NOT NULL,
        [estado_operativo] [varchar](20) NOT NULL DEFAULT 'DISPONIBLE',
        [deposito_propietario_id] [numeric](18, 0) NOT NULL,
        [ubicacion_actual_id] [int] NOT NULL,
        [habilitado_ministerio] [bit] NOT NULL DEFAULT 1,
        [es_propio] [bit] NOT NULL DEFAULT 1,
        [propietario_tercero] [varchar](100) NULL,
        [cuit_tercero] [varchar](13) NULL,
        [creado_el] [datetime] NOT NULL DEFAULT GETDATE(),
        [actualizado_el] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_equipos_biomedicos] PRIMARY KEY CLUSTERED ([id_equipo] ASC),
        CONSTRAINT [UK_equipos_numero_serie] UNIQUE ([numero_serie]),
        CONSTRAINT [UK_equipos_codigo_qr] UNIQUE ([codigo_qr]),
        CONSTRAINT [CK_equipos_estado] CHECK ([estado_operativo] IN ('DISPONIBLE', 'EN_USO', 'EN_MANTENIMIENTO', 'DE_BAJA')),
        CONSTRAINT [FK_equipos_articulo] FOREIGN KEY ([articulo_id]) REFERENCES [dbo].[articulos] ([articulo]),
        CONSTRAINT [FK_equipos_deposito_prop] FOREIGN KEY ([deposito_propietario_id]) REFERENCES [dbo].[depositos] ([id_depositos]),
        CONSTRAINT [FK_equipos_ubicacion_actual] FOREIGN KEY ([ubicacion_actual_id]) REFERENCES [dbo].[ubicaciones] ([id_ubicacion])
    );
    CREATE NONCLUSTERED INDEX [IX_equipos_ubicacion] ON [dbo].[equipos_biomedicos] ([ubicacion_actual_id], [estado_operativo]);
    CREATE NONCLUSTERED INDEX [IX_equipos_sticker] ON [dbo].[equipos_biomedicos] ([numero_sticker]);
END
GO

-- Movimientos de Custodia, Préstamos y Bioseguridad LT8
IF OBJECT_ID(N'dbo.movimientos_equipos', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[movimientos_equipos](
        [id_movimiento] [int] IDENTITY(1,1) NOT NULL,
        [id_equipo] [int] NOT NULL,
        [ubicacion_origen_id] [int] NOT NULL,
        [ubicacion_destino_id] [int] NOT NULL,
        [fecha_salida] [datetime] NOT NULL DEFAULT GETDATE(),
        [fecha_retorno_estimada] [datetime] NULL,
        [fecha_retorno_real] [datetime] NULL,
        [desinfeccion_realizada] [bit] NOT NULL DEFAULT 0,
        [usuario_envia_id] [numeric](18, 0) NULL,
        [usuario_recibe_id] [numeric](18, 0) NULL,
        [estado_movimiento] [varchar](20) NOT NULL DEFAULT 'EN_CURSO',
        [observaciones] [varchar](255) NULL,
        CONSTRAINT [PK_movimientos_equipos] PRIMARY KEY CLUSTERED ([id_movimiento] ASC),
        CONSTRAINT [CK_movimientos_estado] CHECK ([estado_movimiento] IN ('EN_CURSO', 'DEVUELTO', 'RECLAMADO')),
        CONSTRAINT [FK_movimientos_equipo] FOREIGN KEY ([id_equipo]) REFERENCES [dbo].[equipos_biomedicos] ([id_equipo]),
        CONSTRAINT [FK_movimientos_origen] FOREIGN KEY ([ubicacion_origen_id]) REFERENCES [dbo].[ubicaciones] ([id_ubicacion]),
        CONSTRAINT [FK_movimientos_destino] FOREIGN KEY ([ubicacion_destino_id]) REFERENCES [dbo].[ubicaciones] ([id_ubicacion])
    );
    CREATE NONCLUSTERED INDEX [IX_movimientos_equipo_estado] ON [dbo].[movimientos_equipos] ([id_equipo], [estado_movimiento]);
END
GO

-- Órdenes de Mantenimiento y Control Anti-Fuga de Taller
IF OBJECT_ID(N'dbo.mantenimientos_equipos', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[mantenimientos_equipos](
        [id_mantenimiento] [int] IDENTITY(1,1) NOT NULL,
        [id_equipo] [int] NOT NULL,
        [fecha_envio] [datetime] NOT NULL DEFAULT GETDATE(),
        [falla_declarada] [varchar](255) NOT NULL,
        [tipo_taller] [varchar](20) NOT NULL,
        [proveedor_externo] [varchar](100) NULL,
        [numero_remito_externo] [varchar](50) NULL,
        [numero_acta_papel] [varchar](50) NULL,
        [fecha_devolucion] [datetime] NULL,
        [numero_serie_devuelto] [varchar](50) NULL,
        [usuario_entrego_id] [numeric](18, 0) NOT NULL,
        [usuario_recibio_id] [numeric](18, 0) NULL,
        [estado_orden] [varchar](20) NOT NULL DEFAULT 'ABIERTA',
        CONSTRAINT [PK_mantenimientos_equipos] PRIMARY KEY CLUSTERED ([id_mantenimiento] ASC),
        CONSTRAINT [CK_mantenimientos_tipo] CHECK ([tipo_taller] IN ('INTERNO', 'EXTERNO')),
        CONSTRAINT [CK_mantenimientos_estado] CHECK ([estado_orden] IN ('ABIERTA', 'EN_REPARACION', 'CERRADA')),
        CONSTRAINT [FK_mantenimientos_equipo] FOREIGN KEY ([id_equipo]) REFERENCES [dbo].[equipos_biomedicos] ([id_equipo])
    );
END
GO

-- 3. VISTAS DE INTEGRACIÓN
IF OBJECT_ID(N'dbo.vw_sincronizacion_camas', N'V') IS NOT NULL
    DROP VIEW [dbo].[vw_sincronizacion_camas];
GO

CREATE VIEW [dbo].[vw_sincronizacion_camas] AS
SELECT 
    s.[id_sucursal],
    CONCAT(RTRIM(sec.[nombre]), ' - Hab. ', h.[nro_habitacion], ' Cama ', h.[cama]) AS [nombre_ubicacion],
    'HABITACION' AS [tipo_ubicacion],
    RTRIM(sec.[nombre]) AS [sector_piso],
    h.[nro_habitacion] AS [nro_habitacion_legacy],
    h.[cama] AS [cama_legacy],
    h.[sector] AS [sector_legacy]
FROM [dbo].[habitaciones] h
INNER JOIN [dbo].[Sector] sec ON h.[sector] = sec.[sector]
LEFT JOIN [dbo].[sucursales] s ON sec.[id_sucursal] = s.[id_sucursal]
WHERE h.[baja] IS NULL;
GO
