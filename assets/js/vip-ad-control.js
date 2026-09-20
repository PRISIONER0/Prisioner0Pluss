// *=====================================================*
// *PRISIONER0 VIP*
// *CONTROL DE PUBLICIDAD*
// *=====================================================*

document.addEventListener("DOMContentLoaded", async function () {

    const sessionToken = localStorage.getItem(
        "prisioner0_vip_session"
    );

    let vipActivo = false;

    // *=================================================*
    // *COMPROBAR SESIÓN VIP*
    // *=================================================*

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


    // *=================================================*
    // *VIP → NO CARGAR PUBLICIDAD*
    // *=================================================*

    if (vipActivo) {

        console.log(
            "PRISIONER0 VIP: publicidad bloqueada."
        );

        return;
    }


    // *=================================================*
    // *USUARIO NORMAL → CARGAR PUBLICIDAD*
    // *=================================================*


    // *=================================================*
    // *BANNER PC SUPERIOR - EXOCLICK*
    // *=================================================*

    const topDesktop =
        document.getElementById("exoTop");

    if (topDesktop) {

        const ad = document.createElement("ins");

        ad.className = "eas6a97888e2";
        ad.setAttribute("data-zoneid", "6029778");

        topDesktop.appendChild(ad);
    }


    // *=================================================*
    // *BANNER MÓVIL SUPERIOR - EXOCLICK*
    // *=================================================*

    const topMobile =
        document.getElementById("exoTopMobile");

    if (topMobile) {

        const ad = document.createElement("ins");

        ad.className = "eas6a97888e10";
        ad.setAttribute("data-zoneid", "6033958");

        topMobile.appendChild(ad);
    }


    // *=================================================*
    // *BANNER ADHESIVO - EXOCLICK*
    // *=================================================*

    const stickyContainer =
        document.getElementById("exoStickyContainer");

    if (stickyContainer) {

        const ad = document.createElement("ins");

        ad.id = "exoSticky";
        ad.className = "eas6a97888e17";
        ad.setAttribute("data-zoneid", "6029832");

        stickyContainer.appendChild(ad);
    }


    // *=================================================*
    // *CARGAR EXOCLICK*
    // *=================================================*

    const exoScript =
        document.createElement("script");

    exoScript.async = true;

    exoScript.type =
        "application/javascript";

    exoScript.src =
        "https://a.magsrv.com/ad-provider.js";

    exoScript.onload = function () {

        window.AdProvider =
            window.AdProvider || [];

        window.AdProvider.push({
            "serve": {}
        });
    };

    document.head.appendChild(exoScript);


    // *=================================================*
    // *CARGAR POPUNDER SOLO PARA NO VIP*
    // *=================================================*

    const popunderScript =
        document.createElement("script");

    popunderScript.type =
        "application/javascript";

    popunderScript.src =
        "assets/js/exo-popunder.js";

    document.body.appendChild(
        popunderScript
    );


});