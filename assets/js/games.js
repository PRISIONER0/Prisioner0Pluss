/* =====================================================
   PRISIONER0 - GAMES.JS
   Funciones para todas las páginas de juegos
=====================================================*/


/* =====================================================
   MENÚ
=====================================================*/

// Aquí agregaremos Inicio, Juegos, Acerca de y Contacto.


/* =====================================================
   BUSCADOR GLOBAL DE JUEGOS
=====================================================*/

// Obtener el campo de búsqueda
const gameSearch = document.getElementById("gameSearch");

// Obtener el contenedor de resultados
const gamesSearchResults = document.getElementById("gamesSearchResults");

// Primer resultado encontrado
let firstResult = null;

// Detectar si estamos dentro de la carpeta /juegos
const isGamePage = window.location.pathname.includes("/juegos/");

// Ruta de imágenes
const coverPath = isGamePage
    ? "../assets/img/covers/"
    : "assets/img/covers/";

// Ruta hacia las páginas de juegos
const basePath = isGamePage
    ? ""
    : "juegos/";

// Si existe el buscador...
if (gameSearch && gamesSearchResults) {

    gameSearch.addEventListener("input", function () {

        const text = this.value.toLowerCase().trim();

        // Limpiar resultados anteriores
        gamesSearchResults.innerHTML = "";

        // Reiniciar el primer resultado
        firstResult = null;

        // Si el buscador está vacío...
        if (text === "") {

            gamesSearchResults.style.display = "none";
            return;

        }

        // Juego actual (si existe)
        const currentGame = document.body.dataset.game || "";

        // Buscar coincidencias
        const results = games.filter(game =>

            game.title.toLowerCase().includes(text) &&
            game.page !== currentGame

        );

        // Si no encontró resultados...
        if (results.length === 0) {

            gamesSearchResults.style.display = "none";
            return;

        }

        // Mostrar resultados
        gamesSearchResults.style.display = "block";

        // Crear un resultado por cada juego
        results.forEach(game => {

            if (firstResult === null) {

                firstResult = game;

            }

            const item = document.createElement("div");

            item.className = "games-search-result";

            item.innerHTML = `

                <img src="${coverPath}${game.cover}" alt="${game.title}">

                <span>${game.title}</span>

            `;

            // Abrir el juego al hacer clic
            item.addEventListener("click", function () {

                window.location.href = basePath + game.page;

            });

            gamesSearchResults.appendChild(item);

        });

    });

}

// Abrir el primer resultado al presionar Enter
if (gameSearch) {

    gameSearch.addEventListener("keydown", function (e) {

        if (e.key === "Enter" && firstResult) {

            window.location.href = basePath + firstResult.page;

        }

    });

}


/* =====================================================
   LIGHTBOX DE CAPTURAS
=====================================================*/

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

if (lightbox && lightboxImg) {

    document.querySelectorAll(".screenshots-grid img").forEach(img => {

        img.addEventListener("click", function () {

            lightbox.style.display = "flex";
            lightboxImg.src = this.src;

        });

    });

    lightbox.addEventListener("click", function () {

        lightbox.style.display = "none";

    });

}


/* =====================================================
   CERRAR BUSCADOR AL HACER CLIC FUERA
=====================================================*/

document.addEventListener("click", function (e) {

    if (gamesSearchResults && !e.target.closest(".games-search-box")) {

        gamesSearchResults.style.display = "none";

    }

});