import os
from PIL import Image

# Al usar "." el script trabajará AUTOMÁTICAMENTE en la carpeta donde lo ejecutes
directorio = "."

print(f"Iniciando optimización y conversión en: {os.path.abspath(directorio)}")
print("Buscando archivos webp y JPG/JPEG...")

contador = 0

for archivo in os.listdir(directorio):
    ext = archivo.lower()
    # Verifica si es webp o JPG
    if ext.endswith(".webp") or ext.endswith(".jpg") or ext.endswith(".jpeg"):
        ruta_original = os.path.join(directorio, archivo)
        
        # Obtiene el nombre del archivo sin la extensión original
        nombre_base = os.path.splitext(archivo)[0]
        ruta_webp = os.path.join(directorio, f"{nombre_base}.webp")
        
        try:
            with Image.open(ruta_original) as img:
                # Convertir a RGB si es necesario (evita errores con JPGs)
                if img.mode in ("RGBA", "P") and ext.endswith((".jpg", ".jpeg")):
                    img = img.convert("RGB")
                
                # quality=85 y method=6 reducen muchísimo el peso manteniendo la fidelidad visual intacta
                img.save(ruta_webp, "WEBP", quality=85, method=6)
            
            # ELIMINAR EL ARCHIVO ORIGINAL (webp o JPG)
            os.remove(ruta_original)
            
            print(f"✔ Convertido y optimizado: {archivo} -> {nombre_base}.webp (Original eliminado)")
            contador += 1
            
        except Exception as e:
            print(f"❌ Error al procesar {archivo}: {e}")

print(f"\n¡Proceso terminado con éxito! Se optimizaron y eliminaron {contador} imágenes.")
