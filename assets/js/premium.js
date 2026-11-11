/** =========================================
 *  PRISIONER0 PREMIUM
 *  Catálogo independiente
 * ========================================= */


/** CONFIGURACIÓN */

const PREMIUM_GAMES_PER_PAGE = 36;
const PREMIUM_FEATURED_LIMIT = 5;

let premiumCurrentPage = 1;
let premiumExpanded = false;


/** ELEMENTOS DEL DOM */

const premiumFeaturedGrid =
    document.getElementById("premiumFeaturedGrid");

const premiumExpandCatalog =
    document.getElementById("premiumExpandCatalog");

const premiumFullCatalog =
    document.getElementById("premiumFullCatalog");

const premiumGamesGrid =
    document.getElementById("premiumGamesGrid");

const premiumPagination =
    document.getElementById("premiumPagination");


/** =========================================
 *  CREAR TARJETA
 * ========================================= */

function createPremiumGameCard(game) {

    const card = document.createElement("a");

    card.href = `juegos-premium/${game.page}`;
    card.className = "game-card";


    /** IDIOMAS */

    const languages = game.language
        ? game.language.split("/")
        : [];

    const languageHTML = languages.map(language => {

        const lang = language.trim().toLowerCase();

        if (lang === "español") return "Español";

        if (lang === "portuguese" || lang === "português") {
            return "Português";
        }

        if (lang === "english" || lang === "inglés") {
            return "English";
        }

        return language.trim();

    }).filter(Boolean).join(" · ");


    /** DISPOSITIVOS */

    const devicesHTML = `
        <div class="premium-device-info">

            ${game.pc ? `
                <span class="premium-info-item">
                    <i class="fa-solid fa-desktop"></i>
                    PC
                </span>
            ` : ""}

            ${game.android ? `
                <span class="premium-info-item">
                    <i class="fa-solid fa-mobile-screen-button"></i>
                    Android
                </span>
            ` : ""}

        </div>
    `;


    /** IDIOMAS */

    const languageInfoHTML = languageHTML ? `
        <div class="premium-language-info">
            <i class="fa-solid fa-globe"></i>
            <span>${languageHTML}</span>
        </div>
    ` : "";


    /** CONTENIDO DE LA TARJETA */

    card.innerHTML = `

        <img
            src="assets/img/covers/${game.cover}"
            alt="${game.title}"
            loading="lazy"
        >

        <h3>${game.title}</h3>

        <div class="game-info">

            ${devicesHTML}

            ${languageInfoHTML}

        </div>

        <span class="game-button">
            Ver juego
        </span>

    `;

    return card;

}


/** =========================================
 *  JUEGOS DESTACADOS
 * ========================================= */

function renderPremiumFeatured() {

    if (!premiumFeaturedGrid) return;

    premiumFeaturedGrid
        .querySelectorAll(".game-card")
        .forEach(card => card.remove());

    premiumGames
        .slice(0, PREMIUM_FEATURED_LIMIT)
        .forEach(game => {

            const card = createPremiumGameCard(game);

            premiumFeaturedGrid.insertBefore(
                card,
                premiumExpandCatalog
            );

        });

}


/** =========================================
 *  CATÁLOGO COMPLETO
 *  EXCLUYE LOS 5 DESTACADOS
 * ========================================= */

function renderPremiumPage(page = 1) {

    if (!premiumGamesGrid) return;

    const remainingGames = premiumGames.slice(
        PREMIUM_FEATURED_LIMIT
    );

    const totalPages = Math.ceil(
        remainingGames.length / PREMIUM_GAMES_PER_PAGE
    );

    if (remainingGames.length === 0) {

        premiumGamesGrid.innerHTML = "";

        if (premiumPagination) {
            premiumPagination.innerHTML = "";
        }

        return;
    }

    page = Math.max(
        1,
        Math.min(page, totalPages)
    );

    premiumCurrentPage = page;

    const start =
        (page - 1) * PREMIUM_GAMES_PER_PAGE;

    const pageGames = remainingGames.slice(
        start,
        start + PREMIUM_GAMES_PER_PAGE
    );

    premiumGamesGrid.innerHTML = "";

    pageGames.forEach(game => {

        const card = createPremiumGameCard(game);

        premiumGamesGrid.appendChild(card);

    });

    renderPremiumPagination(totalPages);

}


/** =========================================
 *  PAGINACIÓN
 * ========================================= */

function renderPremiumPagination(totalPages) {

    if (!premiumPagination) return;

    premiumPagination.innerHTML = "";

    if (totalPages <= 1) return;


    /** ANTERIOR */

    const previousButton =
        document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "pagination-button";

    previousButton.innerHTML =
        '<i class="fa-solid fa-chevron-left"></i>';

    previousButton.disabled =
        premiumCurrentPage === 1;

    previousButton.addEventListener("click", () => {

        if (premiumCurrentPage > 1) {

            renderPremiumPage(premiumCurrentPage - 1);

            scrollToPremiumCatalog();

        }

    });

    premiumPagination.appendChild(previousButton);


    /** NÚMEROS */

    for (let i = 1; i <= totalPages; i++) {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "pagination-button";
        button.textContent = i;

        if (i === premiumCurrentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {

            if (i === premiumCurrentPage) return;

            renderPremiumPage(i);

            scrollToPremiumCatalog();

        });

        premiumPagination.appendChild(button);

    }


    /** SIGUIENTE */

    const nextButton =
        document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "pagination-button";

    nextButton.innerHTML =
        '<i class="fa-solid fa-chevron-right"></i>';

    nextButton.disabled =
        premiumCurrentPage === totalPages;

    nextButton.addEventListener("click", () => {

        if (premiumCurrentPage < totalPages) {

            renderPremiumPage(premiumCurrentPage + 1);

            scrollToPremiumCatalog();

        }

    });

    premiumPagination.appendChild(nextButton);

}


/** =========================================
 *  SCROLL
 * ========================================= */

function scrollToPremiumCatalog() {

    if (!premiumFullCatalog) return;

    const position =
        premiumFullCatalog.offsetTop - 100;

    window.scrollTo({
        top: position,
        behavior: "smooth"
    });

}


/** =========================================
 *  BOTÓN VER MÁS
 * ========================================= */

if (premiumExpandCatalog && premiumFullCatalog) {

    premiumExpandCatalog.addEventListener("click", function () {

        if (!premiumExpanded) {

            premiumExpanded = true;

            premiumFullCatalog.style.display = "block";

            renderPremiumPage(1);

            const title =
                premiumExpandCatalog.querySelector("h4");

            const description =
                premiumExpandCatalog.querySelector("p");

            const icon =
                premiumExpandCatalog.querySelector(
                    ".premium-more-icon i"
                );

            if (title) {
                title.textContent = "VER MENOS";
            }

            if (description) {
                description.textContent =
                    "Volver a los destacados";
            }

            if (icon) {
                icon.className = "fa-solid fa-minus";
            }

            scrollToPremiumCatalog();

        } else {

            premiumFullCatalog.style.display = "none";

            const title =
                premiumExpandCatalog.querySelector("h4");

            const description =
                premiumExpandCatalog.querySelector("p");

            const icon =
                premiumExpandCatalog.querySelector(
                    ".premium-more-icon i"
                );

            if (title) {
                title.textContent = "VER MÁS";
            }

            if (description) {
                description.textContent =
                    "Descubrí toda la colección";
            }

            if (icon) {
                icon.className = "fa-solid fa-plus";
            }

            premiumExpanded = false;

        }

    });

}


/** =========================================
 *  INICIALIZAR
 * ========================================= */

renderPremiumFeatured();
