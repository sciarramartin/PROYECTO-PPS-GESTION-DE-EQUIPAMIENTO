# Plan de Validación Prototipo con Alejandra (Estrategia WhatsApp 4 Días)
## Validación Visual y Asíncrona sin Sobrecarga Operativa

* **Destinataria:** Alejandra (Responsable General de Equipamiento Biomédico)
* **Objetivo:** Validar intuitivamente el funcionamiento de las 4 pantallas clave del primer prototipo mediante imágenes de alta fidelidad, enviando **1 mensaje por día** para no saturar su rutina hospitalaria.
* **Canal:** WhatsApp (Imagen + Mensaje breve de audio/texto).
* **Duración:** 4 Días hábiles (Lunes a Jueves).

---

## 1. Cronograma Semanal de Validación por WhatsApp

| Día | Pantalla / Prototipo | Foco de Validación | Imagen de Soporte |
| :-: | :--- | :--- | :--- |
| **Día 1 (Lunes)** | **Pantalla 1: Tablero General de Bombas** | Visibilidad del stock de 42 bombas y alertas de retención (+48 hs) | `dashboard_bombas_mockup.jpg` |
| **Día 2 (Martes)** | **Pantalla 2: Préstamo Rápido en 3 Clics** | Agilidad del traslado en 8 segundos (sin datos de pacientes) | `prestamo_rapido_mockup.jpg` |
| **Día 3 (Miércoles)**| **Pantalla 3: Devolución y Bioseguridad LT8** | Reingreso a disponible con tilde obligatorio de desinfección | `reingreso_lt8_mockup.jpg` |
| **Día 4 (Jueves)** | **Pantalla 4: Blindaje de Taller y Remitos** | Validación estricta de serie anti-intercambio y semáforo | `control_taller_mockup.jpg` |
| **Día 5 (Viernes)**| **Cierre de Validación** | Visto bueno formal para iniciar la construcción del MVP 1 | Resumen de conformidades |

---

## 2. Guía Operativa Día por Día (Mensajes Listos para Copiar y Pegar)

```
================================================================================
DÍA 1 (LUNES): EL TABLERO GENERAL Y LAS ALERTAS DE RETENCIÓN
================================================================================
```

### Mockup Visual de la Pantalla 1
![Tablero General de Equipamiento Biomédico](C:/Users/arrai/.gemini/antigravity/brain/e3e36443-8dea-46bf-a5db-559ad746e5f7/dashboard_bombas_mockup_1791245216696.jpg)

### Mensaje para Enviar a Alejandra por WhatsApp:
> *"¡Hola Alejandra! ¿Cómo estás? Espero que hayas arrancado bien la semana.*  
>  
> *Te comparto una imagen de cómo se vería la primera pantalla que vas a ver vos apenas abras el sistema a la mañana desde tu compu o celular.*  
>  
> *Fijate que arriba de todo te resume las **42 bombas de infusión**: cuántas tenés disponibles listas para usar (ej. 24), cuántas están conectadas en pacientes (15) y cuántas están en taller (3).*  
>  
> *Y lo más importante: abajo te puse un recuadro en rojo con una **alerta automática** que te avisa cuáles bombas llevan más de 48 horas en una habitación de internado, para que puedas tocar el botón 'Reclamar' y recuperarla para las terapias.*  
>  
> *¿Te parece que ver esto a primera hora te daría la tranquilidad de saber dónde está cada bomba sin tener que llamar por teléfono a las salas? Con un simple audio contame qué te parece."*

### Qué estamos validando:
1. Si el conteo de 42 bombas discriminado por estado le resulta claro e intuitivo.
2. Si el tiempo de 48 horas para la alerta de retención en piso es adecuado o prefiere otro plazo.

---

```
================================================================================
DÍA 2 (MARTES): PRÉSTAMO RÁPIDO EN 3 CLICS (8 SEGUNDOS)
================================================================================
```

### Mockup Visual de la Pantalla 2
![Ventana de Préstamo Rápido en 3 Clics](C:/Users/arrai/.gemini/antigravity/brain/e3e36443-8dea-46bf-a5db-559ad746e5f7/prestamo_rapido_mockup_1791245248360.jpg)

### Mensaje para Enviar a Alejandra por WhatsApp:
> *"¡Hola Ale! Buen martes.*  
>  
> *Hoy te muestro la ventanita que usarían los supervisores (o vos) cuando alguien viene a buscar una bomba para un piso o quirófano.*  
>  
> *La diseñé pensando en una urgencia para que **tome menos de 10 segundos y solo 3 toques** en la pantalla:*  
> *1. Eligen la bomba poniendo el número de sticker (del 1 al 32) o escaneando el código QR.*  
> *2. Eligen la habitación de destino en la lista desplegable (ej. Habitación 214).*  
> *3. Tocan el botón verde grande 'CONFIRMAR PRÉSTAMO' y listo.*  
>  
> *No les pedimos nombre de paciente, ni DNI, ni Historia Clínica, porque en una urgencia nadie tiene tiempo de cargar eso y al inventario solo le importa en qué cama física está la máquina.*  
>  
> *¿Crees que los supervisores de guardia lo van a usar así de fácil o sentís que falta algún dato indispensable?"*

### Qué estamos validando:
1. Que la regla de los 3 clics no omita ningún dato imprescindible para ella.
2. Que apruebe la decisión de no cargar datos del paciente en el sistema de inventario.

---

```
================================================================================
DÍA 3 (MIÉRCOLES): REINGRESO Y BIOSEGURIDAD LT8 EN 1 CLIC
================================================================================
```

### Mockup Visual de la Pantalla 3
![Ventana de Reingreso y Bioseguridad LT8](C:/Users/arrai/.gemini/antigravity/brain/e3e36443-8dea-46bf-a5db-559ad746e5f7/reingreso_lt8_mockup_1791245287998.jpg)

### Mensaje para Enviar a Alejandra por WhatsApp:
> *"¡Hola Alejandra! Mitad de semana.*  
>  
> *Esta pantalla resuelve el retorno de las bombas cuando el paciente se va de alta o termina el tratamiento:*  
>  
> *Cuando la Supervisión General trae la bomba liberada de vuelta a UTI o Neo, entra a la app y ve esta ventanita. Para no crear pasos molestos con la espera de los 5 minutos del desinfectante, pusimos un tilde obligatorio:*  
> *`[✓] Se realizó desinfección con producto LT8 (Protocolo 5 min cumplido)`*  
>  
> *Al tocar el botón verde, la bomba pasa directamente a **DISPONIBLE** para el próximo paciente. Y en el sistema queda registrado en silencio quién la recibió, el día y la hora exacta, para que estemos 100% cubiertos ante cualquier auditoría del Comité de Infecciones.*  
>  
> *¿Te parece bien que se resuelva con este tilde al recibirla, o preferís otro circuito para la limpieza?"*

### Qué estamos validando:
1. La confirmación del tilde de bioseguridad LT8 sin estados intermedios burocráticos.
2. El respaldo legal silencioso por parte del usuario receptor.

---

```
================================================================================
DÍA 4 (JUEVES): BLINDAJE DE TALLER Y CONTROL ANTI-INTERCAMBIO
================================================================================
```

### Mockup Visual de la Pantalla 4
![Control de Mantenimiento Técnico y Taller](C:/Users/arrai/.gemini/antigravity/brain/e3e36443-8dea-46bf-a5db-559ad746e5f7/control_taller_mockup_1791245328816.jpg)

### Mensaje para Enviar a Alejandra por WhatsApp:
> *"¡Hola Ale! Casi viernes.*  
>  
> *Hoy te comparto la pantalla para blindar las salidas a taller (tanto de respiradores como de bombas):*  
>  
> *Cuando un equipo sale a reparar, anotamos la falla y el número del remito en papel oficial. Pero lo más importante está en el recuadro que te marqué en amarillo:*  
> *👉 **Al momento de recibir el aparato devuelto:** el sistema le exige a quien recibe escribir el número de serie físico de la máquina. Si el service o mantenimiento nos trae otro aparato cambiado (como pasó una vez entre el respirador 2025 y el 1617), la app no lo deja recibir y te manda una alerta roja a vos.*  
>  
> *Y abajo tenés un semáforo que te avisa en rojo los equipos que llevan más de 45 días sin volver para que puedas reclamar.*  
>  
> *¿Pensás que esto termina definitivamente con los problemas de extravíos y cambios en taller?"*

### Qué estamos validando:
1. El bloqueo estricto por número de serie físico devuelto (control anti-fuga).
2. La utilidad del semáforo de días de demora para efectuar reclamos formales.

---

```
================================================================================
DÍA 5 (VIERNES): CIERRE Y VISTO BUENO GLOBAL
================================================================================
```

### Mensaje de Cierre y Próximos Pasos:
> *"¡Hola Alejandra! ¡Buen viernes!*  
>  
> *Con las respuestas y el feedback que me fuiste dando esta semana sobre las 4 pantallas, ya tengo la validación completa de lo que necesitás en el día a día.*  
>  
> *Con esto cierro la etapa de relevamiento y arranco formalmente a programar el primer prototipo funcional (el MVP 1) con el tablero y los préstamos rápidos.*  
>  
> *¡Muchísimas gracias por tu tiempo y la ayuda de toda esta semana!"*

---

## 3. Plan de Contingencia y Consejos para la Interacción

1. **Si Alejandra no responde en el día:**  
   No insistir de inmediato. El personal hospitalario tiene urgencias imprevistas (ingresos críticos, cirugías, inspecciones). Si pasa más de 24 horas, enviar un recordatorio amable:  
   *«¡Hola Ale! Cuando tengas 2 minutitos libres mirate la foto que te mandé ayer y decime qué opinas. ¡Cero apuro!»*
2. **Si Alejandra sugiere un cambio o campo adicional:**  
   Anotar la sugerencia y evaluar su impacto con la *Regla de los 3 clics*:
   * Si es un dato crítico de bioseguridad o legal $\rightarrow$ Se incorpora al criterio de aceptación.
   * Si es un campo burocrático que frenará a la guardia (ej. pedir diagnóstico del paciente) $\rightarrow$ Explicarle con tacto: *«Podemos agregarlo como opcional para que no les trabe el traslado si están corriendo en una urgencia»*.
3. **Guardar las capturas de audio y texto:**  
   Cada respuesta afirmativa de Alejandra en WhatsApp sirve como evidencia formal de validación de requerimientos para el informe final de la PPS en la UTN.
