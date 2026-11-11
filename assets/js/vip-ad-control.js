
/* =====================================================
   PRISIONER0 VIP + PREMIUM
   CONTROL DE PUBLICIDAD
   VIP conserva su funcionamiento original.
   PREMIUM se comprueba de forma independiente.
===================================================== */

const PREMIUM_AD_API =
    "https://prisioner0-premium-api.javiieergutierrez01.workers.dev";

document.addEventListener("DOMContentLoaded", async function () {

    /* =================================================
       COMPROBAR SESIÓN VIP (ORIGINAL)
    ================================================= */

    const sessionToken = localStorage.getItem(
        "prisioner0_vip_session"
    );

    let vipActivo = false;

    if (sessionToken) {

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

            vipActivo =
                data.ok === true &&
                data.vip === true;

        } catch (error) {

            console.error(
                "Error comprobando VIP para publicidad:",
                error
            );

        }
    }

    console.log("VIP activo - publicidad:", vipActivo);

    /* =================================================
       VIP ACTIVO → NO CARGAR PUBLICIDAD
    ================================================= */

    if (vipActivo) {

        document
            .querySelectorAll(".ad-container")
            .forEach(ad => ad.remove());

        return;
    }

    /* =================================================
       COMPROBAR SESIÓN PREMIUM (INDEPENDIENTE)
    ================================================= */

    const premiumToken = localStorage.getItem(
        "prisioner0_premium_session"
    );

    let premiumActivo = false;

    if (premiumToken) {

        try {

            const response = await fetch(
                `${PREMIUM_AD_API}/check-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: premiumToken
                    })
                }
            );

            const data = await response.json();

            premiumActivo =
                data.ok === true &&
                data.premium === true;

        } catch (error) {

            console.error(
                "Error comprobando PREMIUM para publicidad:",
                error
            );

            // Si hay una sesión PREMIUM guardada pero
            // el servidor no responde, evitamos mostrar
            // anuncios hasta poder comprobarla.
            document
                .querySelectorAll(".ad-container")
                .forEach(ad => ad.remove());

            return;
        }
    }

    console.log(
        "PREMIUM activo - publicidad:",
        premiumActivo
    );

    /* =================================================
       PREMIUM ACTIVO → NO CARGAR PUBLICIDAD
    ================================================= */

    if (premiumActivo) {

        document
            .querySelectorAll(".ad-container")
            .forEach(ad => ad.remove());

        return;
    }

    /* =================================================
       USUARIO NORMAL → CARGAR PUBLICIDAD
    ================================================= */

    if (
        typeof aclib === "undefined" ||
        typeof aclib.runBanner !== "function"
    ) {

        console.error(
            "La publicidad no está disponible."
        );

        return;
    }

    /* BANNER PC SUPERIOR */

    const topDesktop =
        document.getElementById("adTop");

    if (topDesktop) {
        aclib.runBanner({
            zoneId: "12031562"
        });
    }

    /* BANNER PC INFERIOR */

    const bottomDesktop =
        document.getElementById("adBottom");

    if (bottomDesktop) {
        aclib.runBanner({
            zoneId: "12031562"
        });
    }

    /* BANNER MÓVIL SUPERIOR */

    const topMobile =
        document.getElementById("adTopMobile");

    if (topMobile) {
        aclib.runBanner({
            zoneId: "12031670"
        });
    }

    /* BANNER MÓVIL INFERIOR */

    const bottomMobile =
        document.getElementById("adBottomMobile");

    if (bottomMobile) {
        aclib.runBanner({
            zoneId: "12031670"
        });
    }

});
