// =====================================================
// PRISIONER0 VIP
// CONTROL DE PUBLICIDAD
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    const sessionToken = localStorage.getItem(
        "prisioner0_vip_session"
    );

    let vipActivo = false;

    // =================================================
    // COMPROBAR SESIÓN VIP
    // =================================================

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

    console.log(
        "VIP activo - publicidad:",
        vipActivo
    );

    // =================================================
    // VIP → NO CARGAR PUBLICIDAD
    // =================================================

    if (vipActivo) {

        document
            .querySelectorAll(".ad-container")
            .forEach(ad => {
                ad.remove();
            });

        return;
    }

    // =================================================
    // USUARIO NORMAL → CARGAR PUBLICIDAD
    // =================================================

    if (
        typeof aclib === "undefined" ||
        typeof aclib.runBanner !== "function"
    ) {

        console.error(
            "La publicidad no está disponible."
        );

        return;
    }

    // =================================================
    // BANNER PC SUPERIOR
    // =================================================

    const topDesktop =
        document.getElementById("adTop");

    if (topDesktop) {

        aclib.runBanner({
            zoneId: "12031562"
        });

    }

    // =================================================
    // BANNER PC INFERIOR
    // =================================================

    const bottomDesktop =
        document.getElementById("adBottom");

    if (bottomDesktop) {

        aclib.runBanner({
            zoneId: "12031562"
        });

    }

    // =================================================
    // BANNER MÓVIL SUPERIOR
    // =================================================

    const topMobile =
        document.getElementById("adTopMobile");

    if (topMobile) {

        aclib.runBanner({
            zoneId: "12031670"
        });

    }

    // =================================================
    // BANNER MÓVIL INFERIOR
    // =================================================

    const bottomMobile =
        document.getElementById("adBottomMobile");

    if (bottomMobile) {

        aclib.runBanner({
            zoneId: "12031670"
        });

    }

});