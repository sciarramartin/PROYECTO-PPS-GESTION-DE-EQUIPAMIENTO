import subprocess
import urllib.request
import json

def get_token():
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
    raise RuntimeError('Token not found')

def close_issue(token, issue_num, comment_body):
    base_url = f'https://api.github.com/repos/sciarramartin/PROYECTO-PPS-GESTION-DE-EQUIPAMIENTO/issues/{issue_num}'
    headers = {
        'Authorization': f'Bearer {token}',
        'User-Agent': 'PPS-Sync',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    }

    # 1. Agregar comentario de cierre
    comment_url = f'{base_url}/comments'
    req = urllib.request.Request(comment_url, data=json.dumps({'body': comment_body}).encode(), headers=headers)
    with urllib.request.urlopen(req) as resp:
        print(f"Comentario agregado en #{issue_num}")

    # 2. Cerrar issue
    patch_req = urllib.request.Request(base_url, data=json.dumps({'state': 'closed'}).encode(), headers=headers, method='PATCH')
    with urllib.request.urlopen(patch_req) as resp:
        print(f"Issue #{issue_num} cerrada exitosamente.")

def main():
    token = get_token()

    close_issue(
        token, 
        3, 
        "✅ **Completada e integrada en rama `develop` (commit `6fe6dca`)**.\n\n"
        "- Generador de etiquetas duales físicas con imagotipo oficial de la Clínica Privada Vélez Sarsfield.\n"
        "- Número corto visible gigante de alta legibilidad para rápida identificación en piso.\n"
        "- Código QR vectorial de alta densidad generado dinámicamente con token del equipo.\n"
        "- Hoja de estilos `@media print` lista para impresión en etiquetas autoadhesivas térmicas (70x40mm y 50x30mm) o planchas A4."
    )

    close_issue(
        token, 
        5, 
        "✅ **Completada e integrada en rama `develop` (commit `6fe6dca`)**.\n\n"
        "- Flujo rápido de traslado de activos en 3 clics optimizado para uso táctil en teléfonos móviles de guardia 24/7 y PC.\n"
        "- Desacoplado de la Historia Clínica del paciente (sin DNI ni contraseñas adicionales requeridas).\n"
        "- Transición reactiva de estado a `EN_USO` con cálculo automático de ventana preventiva de retorno en 48 hs.\n"
        "- Notificación Toast en vivo y actualización reactiva de inventario."
    )

    close_issue(
        token, 
        7, 
        "✅ **Completada e integrada en rama `develop` (commit `6fe6dca`)**.\n\n"
        "- Modal de restitución de equipo al servicio propietario patrimonial con certificación de bioseguridad.\n"
        "- Checkbox obligatorio de desinfección con producto LT8 (Amonio cuaternario de 5ta generación / 5 min de contacto).\n"
        "- Cumplimiento de la Heurística 5 de Nielsen (Prevención de errores): botón bloqueado hasta certificar el procedimiento.\n"
        "- Registro de auditoría con fecha de retorno real y usuario receptor."
    )

if __name__ == '__main__':
    main()
