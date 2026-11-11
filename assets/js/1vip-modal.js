// =====================================================
// PRISIONER0 VIP
// Modal promocional
// =====================================================

(function () {

    // -------------------------------------------------
    // CONFIGURACIÓN
    // -------------------------------------------------

    const DELAY_BEFORE_SHOW = 1000; // 1 segundos
    const CLOSE_DELAY = 3500;       // 3 segundos

    // -------------------------------------------------
    // COMPROBAR SESIÓN VIP
    // -------------------------------------------------

    async function isVipActive() {

        const sessionToken = localStorage.getItem(
            "prisioner0_vip_session"
        );

        if (!sessionToken) {
            return false;
        }

        try {

            const response = await fetch(
                `${VIP_API}/check-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: sessionToken
                    })
                }
            );

            const data = await response.json();

            return (
                data.ok === true &&
                data.vip === true
            );

        } catch (error) {

            console.error(
                "Error comprobando VIP para el modal:",
                error
            );

            return false;
        }
    }

    // -------------------------------------------------
    // CREAR MODAL
    // -------------------------------------------------

    function createVipModal() {

        // Evitar duplicados
        if (
            document.getElementById(
                "prisioner0VipModalOverlay"
            )
        ) {
            return;
        }

        // -------------------------------------------------
        // FONDO
        // -------------------------------------------------

        const overlay = document.createElement("div");

        overlay.id =
            "prisioner0VipModalOverlay";

        // -------------------------------------------------
        // MODAL
        // -------------------------------------------------

        const modal = document.createElement("div");

        modal.className =
            "prisioner0-vip-modal";

        modal.innerHTML = `

            <div class="prisioner0-vip-icon">
                👑
            </div>

            <h2>
                ¿Te molestan los anuncios?
            </h2>

            <p class="prisioner0-vip-main-text">
                Disfrutá PRISIONER0 sin interrupciones.
            </p>

            <div class="prisioner0-vip-price">
                PRISIONER0 VIP
                <strong>$1.99 / mes</strong>
            </div>

            <div class="prisioner0-vip-benefits">

                <div>✓ Sin banners</div>
                <div>✓ Sin publicidad</div>
                <div>✓ Descargas directas</div>

            </div>

            <a
                href="../vip.html"
                class="prisioner0-vip-button"
                target="_blank"
                rel="noopener noreferrer"
            >
                HACERME VIP
            </a>

            <button
                type="button"
                id="prisioner0VipClose"
                class="prisioner0-vip-close"
                disabled
            >
                Cerrar
            </button>

            <p
                id="prisioner0VipCountdown"
                class="prisioner0-vip-countdown"
            >
                Podrás cerrar este mensaje en 3 segundos
            </p>

            <p class="prisioner0-vip-joke">
                Este mensaje no volverá a aparecer... mientras seas VIP. 😉
            </p>

        `;

        overlay.appendChild(modal);

        document.body.appendChild(overlay);

        // -------------------------------------------------
        // CERRAR
        // -------------------------------------------------

        const closeButton =
            document.getElementById(
                "prisioner0VipClose"
            );

        const countdown =
            document.getElementById(
                "prisioner0VipCountdown"
            );

        let seconds = 3;

        const timer = setInterval(function () {

            seconds--;

            if (seconds > 0) {

                countdown.textContent =
                    `Podrás cerrar este mensaje en ${seconds} segundos`;

            } else {

                clearInterval(timer);

                closeButton.disabled = false;

                closeButton.textContent =
                    "Cerrar";

                countdown.textContent =
                    "Ya podés cerrar este mensaje.";

            }

        }, 1000);

        closeButton.addEventListener(
            "click",
            function () {

                overlay.remove();

            }
        );

    }

    // -------------------------------------------------
    // INICIAR
    // -------------------------------------------------

    async function initVipModal() {

        // Esperar 2 segundos antes de comprobar
        // y mostrar el modal.

        setTimeout(async function () {

            const vipActivo =
                await isVipActive();

            // VIP → no mostrar absolutamente nada
            if (vipActivo) {
                return;
            }

            // Usuario normal
            createVipModal();

        }, DELAY_BEFORE_SHOW);

    }

    // -------------------------------------------------
    // DOM READY
    // -------------------------------------------------

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initVipModal
        );

    } else {

        initVipModal();

    }

})();