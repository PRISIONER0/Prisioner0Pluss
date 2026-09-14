document.addEventListener("DOMContentLoaded", () => {

const openTutorial = document.getElementById("openTutorial");

if (!openTutorial) return;

/* =====================================================
   TUTORIALES
   ===================================================== */

const tutorialVideos = {
    pc: {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=5Nc6aBI_w-4"
    },

    android: {
        type: "youtube",
        url: "https://www.youtube.com/embed/raFNdyTVQv8"
    }
};

/* =====================================================
   CREAR MODAL
   ===================================================== */

const modal = document.createElement("div");

modal.id = "tutorialModal";
modal.className = "tutorial-modal";

modal.innerHTML = `
    <div class="tutorial-modal-content">

        <button
            type="button"
            class="tutorial-close"
            aria-label="Cerrar tutorial">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="tutorial-menu">

            <h2>
                <i class="fa-solid fa-circle-question"></i>
                ¿Cómo descargar e instalar?
            </h2>

            <p>
                Selecciona dónde vas a instalar el juego:
            </p>

            <div class="tutorial-options">

                <button
                    type="button"
                    class="tutorial-option"
                    data-platform="pc">

                    <i class="fa-brands fa-windows"></i>

                    <strong>PC</strong>

                    <span>
                        Tutorial para descargar e instalar en PC
                    </span>

                </button>

                <button
                    type="button"
                    class="tutorial-option"
                    data-platform="android">

                    <i class="fa-brands fa-android"></i>

                    <strong>Android</strong>

                    <span>
                        Tutorial para descargar e instalar en Android
                    </span>

                </button>

            </div>

        </div>

        <div
            class="tutorial-player"
            style="display: none;">

            <button
                type="button"
                class="tutorial-back">

                <i class="fa-solid fa-arrow-left"></i>
                Volver

            </button>

            <h2 class="tutorial-player-title"></h2>

            <div class="tutorial-video-container">

                <div class="tutorial-video-wrapper">

                    <iframe
                        class="tutorial-video"
                        src=""
                        title="Tutorial de descarga e instalación"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen>
                    </iframe>

                </div>

            </div>

        </div>

    </div>
`;

document.body.appendChild(modal);

/* =====================================================
   ELEMENTOS DEL MODAL
   ===================================================== */

const closeButton =
    modal.querySelector(".tutorial-close");

const menu =
    modal.querySelector(".tutorial-menu");

const player =
    modal.querySelector(".tutorial-player");

const backButton =
    modal.querySelector(".tutorial-back");

const iframe =
    modal.querySelector(".tutorial-video");

const playerTitle =
    modal.querySelector(".tutorial-player-title");

/* =====================================================
   ABRIR MODAL
   ===================================================== */

openTutorial.addEventListener("click", () => {

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

});

/* =====================================================
   CERRAR MODAL
   ===================================================== */

function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

    iframe.src = "";

    player.style.display = "none";

    menu.style.display = "block";

}

closeButton.addEventListener(
    "click",
    closeModal
);

/* =====================================================
   CERRAR AL HACER CLICK FUERA
   ===================================================== */

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        closeModal();

    }

});

/* =====================================================
   CERRAR CON ESC
   ===================================================== */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {

        closeModal();

    }

});

/* =====================================================
   ABRIR TUTORIAL
   ===================================================== */

const tutorialOptions =
    modal.querySelectorAll(".tutorial-option");

tutorialOptions.forEach(option => {

    option.addEventListener("click", () => {

        const platform =
            option.dataset.platform;

        const tutorial =
            tutorialVideos[platform];

        if (!tutorial) return;

        menu.style.display = "none";

        player.style.display = "block";

        if (platform === "pc") {

            playerTitle.textContent =
                "Tutorial para PC";

            iframe.src =
                "https://www.youtube-nocookie.com/embed/5Nc6aBI_w-4?rel=0";
        }

        if (platform === "android") {
            playerTitle.textContent =
                "Tutorial para Android";

            iframe.src =
                tutorial.url;
        }

    });

});

/* =====================================================
   VOLVER AL MENÚ
   ===================================================== */

backButton.addEventListener("click", () => {

    iframe.src = "";

    player.style.display = "none";

    menu.style.display = "block";

});

});
