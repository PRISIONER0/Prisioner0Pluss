import os
from PIL import Image

# Cambiamos la ruta a la carpeta 'covers'
directorio = r"D:\WEB2\Prisioner0Plus\Prisioner0Plus\assets\img\covers"

print("Buscando imágenes PNG en:", directorio)

contador = 0
for archivo in os.listdir(directorio):
    if archivo.lower().endswith(".png"):
        ruta_png = os.path.join(directorio, archivo)
        
        # Obtiene el nombre limpio sin el '.png'
        nombre_base = os.path.splitext(archivo)[0]
        ruta_webp = os.path.join(directorio, f"{nombre_base}.webp")
        
        with Image.open(ruta_png) as img:
            img.save(ruta_webp, "WEBP", quality=95, method=6)
            
        print(f"¡Listo! -> {nombre_base}.webp")
        contador += 1

print(f"\n¡Proceso terminado! Se convirtieron {contador} imágenes de portadas.")
