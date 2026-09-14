/* =====================================================
   PRISIONER0 - INDEX.JS
   Funciones exclusivas de la página principal
===================================================== */


/* =====================================================
   CONFIGURACIÓN DEL CATÁLOGO
===================================================== */

const GAMES_PER_PAGE = 36;

let currentPage = 1;
let expanded = false;


/* =====================================================
   ELEMENTOS DEL DOM
===================================================== */

const loadMore = document.getElementById("loadMore");
const moreGames = document.getElementById("more-games");
const featuredGames = document.getElementById("featured-games");
const searchInput = document.getElementById("searchInput");


/* =====================================================
   DESTACADOS
===================================================== */

if (featuredGames) {

    games
        .filter(game => game.featured)
        .slice(0, 5)
        .forEach(game => {

            const card = createGameCard(game);

            featuredGames.appendChild(card);
        });

    /*
        VER MÁS queda como sexta tarjeta
        dentro del bloque de destacados.
    */

    if (loadMore) {
        featuredGames.appendChild(loadMore);
    }
}


/* =====================================================
   CREAR TARJETA DE JUEGO
===================================================== */

function createGameCard(game) {

    const card = document.createElement("a");

    card.href = `juegos/${game.page}`;
    card.className = "game-card";

    card.innerHTML = `
        <img
            src="assets/img/covers/${game.cover}"
            alt="${game.title}"
            loading="lazy"
        >

        <h3>${game.title}</h3>

        <div class="game-info">
            ${game.pc ? "<span>🖥 PC</span>" : ""}
            ${game.android ? "<span>📱 Android</span>" : ""}
            <span>🌎 ${game.language}</span>
        </div>

        <span class="game-button">
            Ver Juego
        </span>
    `;

    return card;
}


/* =====================================================
   JUEGOS DEL CATÁLOGO
   SOLO featured: false
===================================================== */

const catalogGames = games.filter(game => !game.featured);


/* =====================================================
   PAGINACIÓN
===================================================== */

let pagination = null;


/*
    Crear automáticamente el contenedor
    de paginación debajo de more-games.
*/

if (moreGames) {

    pagination = document.createElement("div");

    pagination.id = "pagination";
    pagination.className = "pagination";

    moreGames.insertAdjacentElement("afterend", pagination);
}


/* =====================================================
   MOSTRAR UNA PÁGINA
===================================================== */

function renderPage(page, updateURL = true) {

    if (!moreGames) return;

    const totalPages = Math.ceil(
        catalogGames.length / GAMES_PER_PAGE
    );

    /*
        Evitar páginas inexistentes.
    */

    if (totalPages === 0) {
        currentPage = 1;
        moreGames.innerHTML = "";

        if (pagination) {
            pagination.innerHTML = "";
        }

        return;
    }

    page = Math.max(1, Math.min(page, totalPages));

    currentPage = page;

    /*
        Calcular qué juegos corresponden
        a esta página.
    */

    const start = (page - 1) * GAMES_PER_PAGE;
    const end = start + GAMES_PER_PAGE;

    const pageGames = catalogGames.slice(start, end);


    /*
        Limpiar tarjetas anteriores.
        Esto es importante para rendimiento:
        solamente existen en el DOM los juegos
        de la página actual.
    */

    moreGames.innerHTML = "";


    /*
        Crear solamente las tarjetas visibles.
    */

    pageGames.forEach(game => {

        const card = createGameCard(game);

        moreGames.appendChild(card);

    });


    /*
        Crear los botones de paginación.
    */

    renderPagination(totalPages);


    /*
        Guardar la página en la URL
        sin recargar el sitio.
    */

    if (updateURL) {

        const url = new URL(window.location.href);

        if (page === 1) {

            url.searchParams.delete("page");

        } else {

            url.searchParams.set("page", page);

        }

        window.history.replaceState({}, "", url);
    }
}


/* =====================================================
   CREAR BOTONES DE PAGINACIÓN
===================================================== */

function renderPagination(totalPages) {

    if (!pagination) return;

    pagination.innerHTML = "";

    /*
        Si solamente existe una página,
        no mostramos paginación.
    */

    if (totalPages <= 1) {
        return;
    }


    /*
        BOTÓN ANTERIOR
    */

    const previousButton = document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "pagination-button";
    previousButton.innerHTML = `
        <i class="fa-solid fa-chevron-left"></i>
    `;

    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", function () {

        if (currentPage > 1) {

            renderPage(currentPage - 1);

            scrollToCatalog();

        }

    });

    pagination.appendChild(previousButton);


    /*
        NÚMEROS DE PÁGINA
    */

    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");

        pageButton.type = "button";
        pageButton.className = "pagination-button";

        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function () {

            if (i === currentPage) return;

            renderPage(i);

            scrollToCatalog();

        });

        pagination.appendChild(pageButton);
    }


    /*
        BOTÓN SIGUIENTE
    */

    const nextButton = document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "pagination-button";

    nextButton.innerHTML = `
        <i class="fa-solid fa-chevron-right"></i>
    `;

    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", function () {

        if (currentPage < totalPages) {

            renderPage(currentPage + 1);

            scrollToCatalog();

        }

    });

    pagination.appendChild(nextButton);
}


/* =====================================================
   SCROLL AL CATÁLOGO
===================================================== */

function scrollToCatalog() {

    const catalog = document.getElementById("juegos");

    if (!catalog) return;

    const position = catalog.offsetTop - 100;

    window.scrollTo({
        top: position,
        behavior: "smooth"
    });
}


/* =====================================================
   BOTÓN "VER MÁS"
===================================================== */

if (loadMore && moreGames) {

    loadMore.addEventListener("click", function () {

        if (!expanded) {

            /*
                Mostrar catálogo
                comenzando siempre desde página 1.
            */

            expanded = true;

            renderPage(1);


            /*
                Cambiar texto e icono.
            */

            loadMore.querySelector("span").textContent = "Ver menos";

            loadMore.querySelector("i").className =
                "fa-solid fa-minus";


            /*
                Mostrar catálogo.
            */

            moreGames.style.display = "grid";


            /*
                Mostrar paginación.
            */

            if (pagination) {
                pagination.style.display = "flex";
            }


            /*
                Bajar suavemente al catálogo.
            */

            const position = moreGames.offsetTop - 120;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

        } else {

            /*
                Ocultar catálogo.
            */

            moreGames.style.display = "none";


            if (pagination) {
                pagination.style.display = "none";
            }


            /*
                Restaurar botón.
            */

            loadMore.querySelector("span").textContent = "Ver más";

            loadMore.querySelector("i").className =
                "fa-solid fa-plus";


            /*
                Volver al inicio del catálogo.
            */

            const position =
                document.getElementById("juegos").offsetTop - 100;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

            expanded = false;
        }
    });
}


/* =====================================================
   BUSCADOR
===================================================== */

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const value = this.value.toLowerCase().trim();


        /*
            BUSCADOR VACÍO
        */

        if (value === "") {

            /*
                Restaurar página actual.
            */

            if (expanded) {

                renderPage(currentPage);

            }

            /*
                Restaurar destacados.
            */

            if (featuredGames) {

                featuredGames
                    .querySelectorAll(".game-card")
                    .forEach(card => {

                        card.style.display = "";

                    });
            }

            return;
        }


        /*
            Mostrar catálogo automáticamente.
        */

        if (!expanded) {

            expanded = true;

            moreGames.style.display = "grid";

            loadMore.querySelector("span").textContent =
                "Ver menos";

            loadMore.querySelector("i").className =
                "fa-solid fa-minus";

            if (pagination) {
                pagination.style.display = "none";
            }
        }


        /*
            Buscar en TODOS los juegos del catálogo,
            no solamente en los 36 visibles.
        */

        const results = catalogGames.filter(game =>
            game.title.toLowerCase().includes(value)
        );


        /*
            Limpiar catálogo actual.
        */

        moreGames.innerHTML = "";


        /*
            Mostrar resultados encontrados.
        */

        results.forEach(game => {

            const card = createGameCard(game);

            moreGames.appendChild(card);

        });


        /*
            Ocultar paginación durante una búsqueda.
        */

        if (pagination) {
            pagination.style.display = "none";
        }


        /*
            Filtrar también los destacados.
        */

        if (featuredGames) {

            featuredGames
                .querySelectorAll(".game-card")
                .forEach(card => {

                    const title =
                        card.querySelector("h3");

                    if (!title) return;

                    const gameTitle =
                        title.textContent.toLowerCase();

                    if (gameTitle.includes(value)) {

                        card.style.display = "";

                    } else {

                        /*
                            No ocultar VER MÁS.
                        */

                        if (card !== loadMore) {
                            card.style.display = "none";
                        }
                    }
                });
        }


        /*
            Bajar al catálogo.
        */

        const position =
            document.getElementById("juegos").offsetTop - 110;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });

    });
}


/* =====================================================
   LEER PÁGINA DESDE LA URL
===================================================== */

const urlParams = new URLSearchParams(
    window.location.search
);

const requestedPage =
    parseInt(urlParams.get("page"), 10);


/*
    Si la URL tiene ?page=2,
    dejamos preparada esa página.
*/

if (
    !isNaN(requestedPage) &&
    requestedPage > 0
) {

    currentPage = requestedPage;

}


/* =====================================================
   BOTÓN "INICIO"
===================================================== */

const homeLink =
    document.querySelector('a[href="#inicio"]');

const hero =
    document.getElementById("inicio");

if (homeLink && hero) {

    homeLink.addEventListener("click", function (e) {

        e.preventDefault();

        const position =
            hero.offsetTop - 50;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });

    });
}
function copiarTexto(idElemento, boton) {
    const textoACopiar = document.getElementById(idElemento).innerText;

    navigator.clipboard.writeText(textoACopiar).then(() => {
        // Cambiar el texto e icono del botón temporalmente
        const contenidoOriginal = boton.innerHTML;
        boton.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        boton.classList.add('copied');

        // Restaurar después de 2 segundos
        setTimeout(() => {
            boton.innerHTML = contenidoOriginal;
            boton.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}