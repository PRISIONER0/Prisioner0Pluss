import os
from PIL import Image

# Al usar "." el script trabajará AUTOMÁTICAMENTE en la carpeta donde lo ejecutes
directorio = "."

print(f"Iniciando optimización y conversión en: {os.path.abspath(directorio)}")
print("Buscando archivos JPG, JPEG y PNG nuevos...")

contador = 0

for archivo in os.listdir(directorio):
    # Obtenemos el nombre base y la extensión por separado de forma segura
    nombre_base, ext = os.path.splitext(archivo)
    ext = ext.lower()
    
    # Verificamos que sea una imagen que queramos convertir (EXCLUYENDO .webp para no dañar los existentes)
    if ext in (".jpg", ".jpeg", ".png"):
        ruta_original = os.path.join(directorio, archivo)
        ruta_webp = os.path.join(directorio, f"{nombre_base}.webp")
        
        try:
            with Image.open(ruta_original) as img:
                # Si es un PNG con transparencia (RGBA) o paleta (P), lo pasamos a RGB o mantenemos RGBA según convenga.
                # Nota: El formato WEBP soporta transparencia perfectamente. Si tus PNG tienen fondo transparente, 
                # puedes quitar la conversión forzada a RGB para que conserven la transparencia.
                if ext == ".png":
                    # Si quieres conservar transparencias en tus PNGs, puedes comentar la línea de conversión si da error,
                    # pero WEBP maneja RGBA de forma nativa excelente.
                    pass
                elif img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # quality=85 y method=6 reducen muchísimo el peso manteniendo la fidelidad visual intacta
                img.save(ruta_webp, "WEBP", quality=85, method=6)
            
            # ELIMINAR EL ARCHIVO ORIGINAL (jpg, jpeg o png) solo si se creó el webp con éxito
            os.remove(ruta_original)
            
            print(f"✔ Convertido y optimizado: {archivo} -> {nombre_base}.webp (Original eliminado)")
            contador += 1
            
        except Exception as e:
            print(f"❌ Error al procesar {archivo}: {e}")

print(f"\n¡Proceso terminado con éxito! Se optimizaron, convirtieron y eliminaron {contador} imágenes.")