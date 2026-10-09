// ============================================
// PRISIONER0 VIP ACCESS
// ============================================

const VIP_ACCESS_API =
    "https://prisioner0-vip-api.javiieergutierrez01.workers.dev";


// ============================================
// COMPROBAR SESIÓN VIP
// ============================================

async function checkVipAccess() {

    const sessionToken =
        localStorage.getItem("prisioner0_vip_session");

    // No hay sesión
    if (!sessionToken) {
        showVipAccessLocked();
        return false;
    }

    try {

        const response = await fetch(`${VIP_ACCESS_API}/check-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_token: sessionToken
            })
        });

        const data = await response.json();

        if (data.ok === true && data.vip === true) {

            showVipAccessUnlocked();
            return true;

        }

        // Sesión inválida
        showVipAccessLocked();

        return false;

    } catch (error) {

        console.error("Error comprobando acceso VIP:", error);

        showVipAccessLocked();

        return false;
    }
}


// ============================================
// ESTADO: NO VIP
// ============================================

function showVipAccessLocked() {

    const container =
        document.getElementById("vipAccess");

    if (!container) return;

    container.innerHTML = `
        <a href="../vip.html" class="download-btn">
            <i class="fa-solid fa-lock"></i>
            Obtener acceso VIP
        </a>
    `;
}


// ============================================
// ESTADO: VIP ACTIVADO
// ============================================

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
                <img src="https://flagcdn.com/20x15/es.png" alt="Español">
                <img src="https://flagcdn.com/20x15/br.png" alt="Português">
            </span>

            Descargar Traduccion (PC)

        </a>

        <a href="#"
           class="download-btn vip-access-download"
           onclick="requestVipDownload('android'); return false;">

            <i class="fa-solid fa-mobile-screen-button"></i>

            <span class="vip-flags">
                <img src="https://flagcdn.com/20x15/es.png" alt="Español">
                <img src="https://flagcdn.com/20x15/br.png" alt="Português">
            </span>

            Descargar Juego (Android)

        </a>
    `;
}


// ============================================
// SOLICITAR DESCARGA VIP
// ============================================

async function requestVipDownload(platform) {

    const sessionToken =
        localStorage.getItem("prisioner0_vip_session");

    if (!sessionToken) {
        alert("Necesitas tener una suscripción VIP activa.");
        return;
    }

    try {

        // Comprobar que la sesión VIP sigue activa
        const response = await fetch(
            `${VIP_ACCESS_API}/check-session`,
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

        if (!data.ok || data.vip !== true) {
            alert("Tu sesión VIP no está activa.");
            return;
        }

        // =========================================
        // DESCARGA PC
        // =========================================

        if (platform === "pc") {

            window.location.href =
                "https://github.com/PRISIONER0/ACupofDreams-Espa-ol/releases/download/v1.0/kingdom-of-marionettes-CAP2-PRISIONER0.zip";

            return;
        }

        // =========================================
        // DESCARGA ANDROID
        // =========================================

        if (platform === "android") {

            window.location.href =
                "https://github.com/PRISIONER0/ACupofDreams-Espa-ol/releases/download/v1.0/komv2.prisioner0-2.0-1791390618-release.apk";

            return;
        }

    } catch (error) {

        console.error(
            "Error comprobando acceso VIP:",
            error
        );

        alert(
            "No se pudo comprobar tu acceso VIP. " +
            "Inténtalo nuevamente."
        );
    }
}


// ============================================
// INICIAR
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    checkVipAccess();

});

// *============================================*
// *BLOQUEAR MENÚ DERECHO EN BOTONES VIP*
// *============================================*

document.addEventListener("contextmenu", function(event) {

    if (event.target.closest(".vip-access-download")) {
        event.preventDefault();
    }

});