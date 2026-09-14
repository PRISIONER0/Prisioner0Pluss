// =====================================================
// COMPROBAR SESIÓN VIP
// =====================================================

async function checkVipSession() {

    const sessionToken =
        localStorage.getItem(
            "prisioner0_vip_session"
        );

    if (!sessionToken) {
        return false;
    }

    try {

        const response =
            await fetch(
                `${VIP_API}/check-session`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        session_token:
                            sessionToken
                    })
                }
            );

        const data =
            await response.json();

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


// =====================================================
// CONFIGURAR DESCARGAS
// =====================================================

async function setupVipDownloads() {

    const buttons =
        document.querySelectorAll(
            ".download-vip"
        );

    if (!buttons.length) {
        return;
    }

    const vipActivo =
        await checkVipSession();

    console.log(
        "VIP activo:",
        vipActivo
    );

    buttons.forEach(button => {

        const direct =
            button.dataset.direct;

        const short =
            button.dataset.short;

        if (!direct || !short) {
            return;
        }

        // ==========================================
        // VIP → ENLACE DIRECTO
        // ==========================================

        if (vipActivo) {

            button.href = direct;

            button.dataset.vip =
                "true";

        }

        // ==========================================
        // NORMAL → ACORTADOR
        // ==========================================

        else {

            button.href = short;

            button.dataset.vip =
                "false";

        }

    });

}


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    setupVipDownloads
);