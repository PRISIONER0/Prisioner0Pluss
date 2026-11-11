
/* ============================================
   PRISIONER0 VIP + PREMIUM ACCESS
============================================ */

const VIP_ACCESS_API =
    "https://prisioner0-vip-api.javiieergutierrez01.workers.dev";

const PREMIUM_ACCESS_API =
    "https://prisioner0-premium-api.javiieergutierrez01.workers.dev";


/* ============================================
   COMPROBAR UNA SESIÓN
============================================ */

async function checkAccess(api, token, type) {

    if (!token) return false;

    try {

        const response = await fetch(`${api}/check-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_token: token
            })
        });

        if (!response.ok) return false;

        const data = await response.json();

        if (type === "vip") {
            return data.ok === true && data.vip === true;
        }

        if (type === "premium") {
            return data.ok === true && data.premium === true;
        }

        return false;

    } catch (error) {

        console.error(`Error comprobando sesión ${type}:`, error);
        return false;
    }
}


/* ============================================
   COMPROBAR ACCESO VIP O PREMIUM
============================================ */

async function checkVipAccess() {

    const vipToken =
        localStorage.getItem("prisioner0_vip_session");

    const premiumToken =
        localStorage.getItem("prisioner0_premium_session");

    const [vipActive, premiumActive] = await Promise.all([

        checkAccess(VIP_ACCESS_API, vipToken, "vip"),

        checkAccess(PREMIUM_ACCESS_API, premiumToken, "premium")

    ]);

    if (vipActive || premiumActive) {

        showVipAccessUnlocked();
        return true;

    }

    showVipAccessLocked();
    return false;
}


/* ============================================
   ESTADO: SIN ACCESO
============================================ */

function showVipAccessLocked() {

    const container =
        document.getElementById("vipAccess");

    if (!container) return;

    container.innerHTML = `
        <a href="../vip.html" class="download-btn">
            <i class="fa-solid fa-lock"></i>
            Obtener acceso VIP o Premium
        </a>
    `;
}


/* ============================================
   ESTADO: VIP O PREMIUM ACTIVADO
============================================ */

function showVipAccessUnlocked() {

    const container =
        document.getElementById("vipAccess");

    if (!container) return;

    container.innerHTML = `

        <a href="#"
           class="download-btn vip-access-download"
           onclick="requestVipDownload('pc'); return false;">

            <i class="fa-solid fa-desktop"></i>

            <span class="vip-flags">
                <img src="https://flagcdn.com/20x15/es.png"
                     alt="Español">
            </span>

            Descargar Traducción (PC)

        </a>

        <a href="#"
           class="download-btn vip-access-download"
           onclick="requestVipDownload('android'); return false;">

            <i class="fa-solid fa-mobile-screen-button"></i>

            <span class="vip-flags">
                <img src="https://flagcdn.com/20x15/es.png"
                     alt="Español">
            </span>

            Descargar Juego (Android)

        </a>

    `;
}


/* ============================================
   SOLICITAR DESCARGA
============================================ */

async function requestVipDownload(platform) {

    const vipToken =
        localStorage.getItem("prisioner0_vip_session");

    const premiumToken =
        localStorage.getItem("prisioner0_premium_session");

    try {

        /* Comprobar ambas sesiones */

        const [vipActive, premiumActive] = await Promise.all([

            checkAccess(VIP_ACCESS_API, vipToken, "vip"),

            checkAccess(PREMIUM_ACCESS_API, premiumToken, "premium")

        ]);

        if (!vipActive && !premiumActive) {

            alert("Tu acceso VIP o Premium no está activo.");

            showVipAccessLocked();

            return;
        }


        /* =====================================
           DESCARGA PC
        ===================================== */

        if (platform === "pc") {

            window.location.href =
                "https://github.com/PRISIONER0/ACupofDreams-Espa-ol/releases/download/v1.0/PRISIONER0_Bloody.Painter.Dating.Sim.DLC.zip";

            return;
        }


        /* =====================================
           DESCARGA ANDROID
        ===================================== */

        if (platform === "android") {

            window.location.href =
                "https://github.com/PRISIONER0/ACupofDreams-Espa-ol/releases/download/v1.0/PRISIONER0_Bloody.Painter.Dating.Sim.DLC.apk";

            return;
        }

    } catch (error) {

        console.error("Error comprobando acceso:", error);

        alert(
            "No se pudo comprobar tu acceso. Inténtalo nuevamente."
        );
    }
}


/* ============================================
   INICIAR
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    checkVipAccess();

});


/* ============================================
   BLOQUEAR MENÚ DERECHO EN BOTONES
============================================ */

document.addEventListener("contextmenu", function(event) {

    if (event.target.closest(".vip-access-download")) {

        event.preventDefault();

    }

});
