import os
from PIL import Image

def convertir_imagenes():
    # Ruta fija directa a la carpeta que me mostraste en la foto
    carpeta_img = r"D:\PRISIONERO-WEB\backup\Prisioner0\assets\img"
    
    contador = 0
    # Procesa los archivos de la carpeta 'img'
    for archivo in os.listdir(carpeta_img):
        if archivo.lower().endswith(".png"):
            ruta_png = os.path.join(carpeta_img, archivo)
            
            # CORRECCIÓN: Agregamos [0] para extraer correctamente el nombre sin el .png
            nombre_base = os.path.splitext(archivo)[0]
            ruta_webp = os.path.join(carpeta_img, f"{nombre_base}.webp")
            
            try:
                with Image.open(ruta_png) as img:
                    img.save(ruta_webp, "WEBP", quality=92, method=6)
                print(f"Convertido: {archivo} -> {nombre_base}.webp")
                
                # Borra el PNG original
                os.remove(ruta_png)
                contador += 1
            except Exception as e:
                print(f"Error con {archivo}: {e}")
                
    print(f"\n¡Listo! Se convirtieron y limpiaron {contador} imagenes.")

if __name__ == "__main__":
    convertir_imagenes()
