
/* =====================================================
   PRISIONER0 VIP + PREMIUM
   CONTROL DE DESCARGAS
   VIP conserva su funcionamiento original.
===================================================== */

const PREMIUM_DOWNLOAD_API =
    "https://prisioner0-premium-api.javiieergutierrez01.workers.dev";


/* =====================================================
   COMPROBAR SESIÓN VIP
===================================================== */

async function checkVipSession() {

    const sessionToken =
        localStorage.getItem("prisioner0_vip_session");

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

        return data.ok === true &&
               data.vip === true;

    } catch (error) {

        console.error(
            "Error comprobando VIP:",
            error
        );

        return false;
    }
}


/* =====================================================
   COMPROBAR SESIÓN PREMIUM
===================================================== */

async function checkPremiumDownloadSession() {

    const sessionToken =
        localStorage.getItem("prisioner0_premium_session");

    if (!sessionToken) {
        return false;
    }

    try {

        const response = await fetch(
            `${PREMIUM_DOWNLOAD_API}/check-session`,
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

        return data.ok === true &&
               data.premium === true;

    } catch (error) {

        console.error(
            "Error comprobando PREMIUM:",
            error
        );

        return false;
    }
}


/* =====================================================
   CONFIGURAR DESCARGAS
===================================================== */

async function setupVipDownloads() {

    const buttons =
        document.querySelectorAll(".download-vip");

    if (!buttons.length) {
        return;
    }

    // Comprobar ambas membresías.
    const [vipActivo, premiumActivo] =
        await Promise.all([
            checkVipSession(),
            checkPremiumDownloadSession()
        ]);

    const membresiaActiva =
        vipActivo || premiumActivo;

    console.log("VIP activo:", vipActivo);
    console.log("PREMIUM activo:", premiumActivo);
    console.log("Acceso a descargas directas:", membresiaActiva);


    buttons.forEach(button => {

        const direct = button.dataset.direct;
        const short = button.dataset.short;

        if (!direct || !short) {
            return;
        }

        /* ==========================================
           VIP O PREMIUM → ENLACE DIRECTO
        ========================================== */

        if (membresiaActiva) {

            button.href = direct;
            button.dataset.vip = "true";

        }

        /* ==========================================
           USUARIO NORMAL → ACORTADOR
        ========================================== */

        else {

            button.href = short;
            button.dataset.vip = "false";

        }

    });

}


/* =====================================================
   INICIAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    setupVipDownloads
);
