/* =====================================================
   PRISIONER0 PLUS — CONTROL CENTRAL DE PUBLICIDAD

   PARA CAMBIAR LA PUBLICIDAD EN EL FUTURO:
   1. Editar únicamente los valores de CONFIGURACIÓN.
   2. No hace falta modificar las páginas HTML.

   HilltopAds solo se carga si el usuario NO tiene una
   sesión VIP ni PREMIUM válida.
===================================================== */

const HILLTOPADS_CONFIG = {
    enabled: true,
    // Zona HilltopAds configurada actualmente para PRISIONER0 PLUS.
    scriptUrl: "//surprisedplate.com/cnDW9c6.bb2/5/l/S/WaQW9oNczFY/1MM_DrkO4TOUS/0A3KNij/UNw/OvT/kcz-",
    // Máximo 3 cargas del script en cualquier período móvil de 60 minutos.
    maxLoads: 3,
    windowMinutes: 60,
    waitForAgeGate: true,
    frequencyStorageKey: "prisioner0_hilltopads_loads",
    vipApi: "https://prisioner0-vip-api.javiieergutierrez01.workers.dev",
    premiumApi: "https://prisioner0-premium-api.javiieergutierrez01.workers.dev"
};

async function hilltopCheckSession(api, token, type) {
    if (!token) return false;
    try {
        const response = await fetch(`${api}/check-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: token })
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (type === "vip") return data.ok === true && data.vip === true;
        if (type === "premium") return data.ok === true && data.premium === true;
        return false;
    } catch (error) {
        console.warn(`No se pudo comprobar la sesión ${type}:`, error);
        return null;
    }
}

function hilltopLoadAd() {
    if (!HILLTOPADS_CONFIG.enabled || !HILLTOPADS_CONFIG.scriptUrl) return;
    if (document.getElementById("prisioner0-hilltopads-script")) return;

    const now = Date.now();
    const windowMs = HILLTOPADS_CONFIG.windowMinutes * 60 * 1000;
    let loads = [];
    try {
        const stored = JSON.parse(localStorage.getItem(HILLTOPADS_CONFIG.frequencyStorageKey) || "[]");
        if (Array.isArray(stored)) {
            loads = stored.filter(value => Number.isFinite(value) && now - value < windowMs && now >= value);
        }
        if (loads.length >= HILLTOPADS_CONFIG.maxLoads) {
            console.log("HilltopAds: límite de 3 cargas por hora alcanzado.");
            return;
        }
        loads.push(now);
        localStorage.setItem(HILLTOPADS_CONFIG.frequencyStorageKey, JSON.stringify(loads));
    } catch (error) {
        console.warn("No se pudo aplicar el límite local de HilltopAds:", error);
    }

    const script = document.createElement("script");
    script.id = "prisioner0-hilltopads-script";
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src = HILLTOPADS_CONFIG.scriptUrl;
    (document.head || document.body || document.documentElement).appendChild(script);
}

function hilltopWaitForAgeGate() {
    if (!HILLTOPADS_CONFIG.waitForAgeGate || !document.body ||
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
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    });
}

(async function initHilltopAds() {
    if (!HILLTOPADS_CONFIG.enabled) return;

    let vipToken = null;
    let premiumToken = null;
    try {
        vipToken = localStorage.getItem("prisioner0_vip_session");
        premiumToken = localStorage.getItem("prisioner0_premium_session");
    } catch (error) {
        console.warn("No se pudieron leer las sesiones; publicidad desactivada.", error);
        return;
    }

    const [vipStatus, premiumStatus] = await Promise.all([
        hilltopCheckSession(HILLTOPADS_CONFIG.vipApi, vipToken, "vip"),
        hilltopCheckSession(HILLTOPADS_CONFIG.premiumApi, premiumToken, "premium")
    ]);

    if (vipStatus === true || premiumStatus === true) return;
    if ((vipToken && vipStatus === null) || (premiumToken && premiumStatus === null)) return;

    await hilltopWaitForAgeGate();
    hilltopLoadAd();
})();
