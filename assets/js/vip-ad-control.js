/* =====================================================
   PRISIONER0 PLUS — CONTROL CENTRAL DE PUBLICIDAD

   PARA CAMBIAR LA PUBLICIDAD EN EL FUTURO:
   1. Editar únicamente los valores de CONFIGURACIÓN.
   2. No hace falta modificar las páginas HTML.

   HilltopAds solo se carga si el usuario NO tiene una
   sesión VIP ni PREMIUM válida.
===================================================== */

const HILLTOPADS_CONFIG = {
    // Activar o desactivar toda la publicidad HilltopAds.
    enabled: true,

    // Código único de la zona HilltopAds #7650989.
    scriptUrl: "//surprisedplate.com/cnDW9c6.bb2/5/l/S/WaQW9oNczFY/1MM_DrkO4TOUS/0A3KNij/UNw/OvT/kcz-",

    // Frecuencia máxima local: una carga cada 24 horas.
    // Cambiar a 12 para permitir una carga cada 12 horas.
    frequencyCapHours: 24,

    // En PLUS, esperar a que el visitante confirme la mayoría de edad.
    waitForAgeGate: true,

    // Clave interna para recordar cuándo se cargó el script.
    frequencyStorageKey: "prisioner0_hilltopads_last_load",

    // APIs oficiales de las sesiones VIP y PREMIUM.
    vipApi: "https://prisioner0-vip-api.javiieergutierrez01.workers.dev",
    premiumApi: "https://prisioner0-premium-api.javiieergutierrez01.workers.dev"
};


/* =====================================================
   VALIDAR SESIONES
===================================================== */

async function hilltopCheckSession(api, token, type) {
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

        if (!response.ok) return null;

        const data = await response.json();

        if (type === "vip") {
            return data.ok === true && data.vip === true;
        }

        if (type === "premium") {
            return data.ok === true && data.premium === true;
        }

        return false;

    } catch (error) {
        console.warn(`No se pudo comprobar la sesión ${type}:`, error);
        return null;
    }
}


/* =====================================================
   CARGAR HILLTOPADS
===================================================== */

function hilltopLoadAd() {
    if (!HILLTOPADS_CONFIG.enabled || !HILLTOPADS_CONFIG.scriptUrl) {
        return;
    }

    // Límite local adicional: como máximo una carga por período.
    const capMs = HILLTOPADS_CONFIG.frequencyCapHours * 60 * 60 * 1000;
    const now = Date.now();

    try {
        const lastLoad = Number(
            localStorage.getItem(HILLTOPADS_CONFIG.frequencyStorageKey) || 0
        );

        if (lastLoad && now - lastLoad < capMs) {
            return;
        }

        // Registrar antes de insertar para evitar cargas duplicadas.
        localStorage.setItem(
            HILLTOPADS_CONFIG.frequencyStorageKey,
            String(now)
        );

    } catch (error) {
        // Si el navegador bloquea el almacenamiento, seguimos sin
        // persistir el límite entre visitas.
        console.warn("No se pudo guardar el límite de publicidad:", error);
    }

    // Evitar que una misma página inserte el código dos veces.
    if (document.getElementById("prisioner0-hilltopads-script")) {
        return;
    }

    const script = document.createElement("script");
    script.id = "prisioner0-hilltopads-script";
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src = HILLTOPADS_CONFIG.scriptUrl;

    (document.head || document.body || document.documentElement)
        .appendChild(script);
}


/* =====================================================
   RESPETAR LA VERIFICACIÓN DE EDAD DE PLUS
===================================================== */

function hilltopWaitForAgeGate() {
    if (!HILLTOPADS_CONFIG.waitForAgeGate ||
        !document.body ||
        !document.body.classList.contains("ads-locked")) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            if (!document.body.classList.contains("ads-locked")) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"]
        });
    });
}


/* =====================================================
   INICIO: VIP / PREMIUM SIEMPRE TIENEN PRIORIDAD
===================================================== */

(async function initHilltopAds() {
    if (!HILLTOPADS_CONFIG.enabled) return;

    let vipToken = null;
    let premiumToken = null;

    try {
        vipToken = localStorage.getItem("prisioner0_vip_session");
        premiumToken = localStorage.getItem("prisioner0_premium_session");
    } catch (error) {
        // Si no se puede consultar el almacenamiento, no activamos anuncios.
        console.warn("No se pudieron leer las sesiones; publicidad desactivada.", error);
        return;
    }

    const [vipStatus, premiumStatus] = await Promise.all([
        hilltopCheckSession(HILLTOPADS_CONFIG.vipApi, vipToken, "vip"),
        hilltopCheckSession(HILLTOPADS_CONFIG.premiumApi, premiumToken, "premium")
    ]);

    // Una sesión válida de cualquiera de los dos planes bloquea anuncios.
    if (vipStatus === true || premiumStatus === true) {
        console.log("HilltopAds: no se carga; usuario VIP o PREMIUM activo.");
        return;
    }

    // Si había un token guardado pero no se pudo verificar con el servidor,
    // preferimos no mostrar anuncios por seguridad.
    if ((vipToken && vipStatus === null) ||
        (premiumToken && premiumStatus === null)) {
        console.warn("HilltopAds: no se pudo verificar una sesión; publicidad desactivada.");
        return;
    }

    // No mostrar Popunder detrás del modal de verificación +18.
    await hilltopWaitForAgeGate();

    hilltopLoadAd();
})();
