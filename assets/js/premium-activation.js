/* =====================================================
   PRISIONER0 PREMIUM
   Activación, validación de sesión y dispositivos
   Sistema independiente de VIP
===================================================== */

const PREMIUM_API =
    "https://prisioner0-premium-api.javiieergutierrez01.workers.dev";

const PREMIUM_SESSION_KEY = "prisioner0_premium_session";
const PREMIUM_CODE_KEY = "prisioner0_premium_code";
const PREMIUM_EXPIRES_KEY = "prisioner0_premium_expires";

const PREMIUM_REQUEST_TIMEOUT = 15000;


// =====================================================
// ELEMENTOS
// =====================================================

const premiumCodeInput = document.getElementById("premiumCode");
const premiumActivateButton = document.getElementById("activatePremium");
const premiumMessage = document.getElementById("premiumMessage");
const premiumActivateForm = document.getElementById("premiumActivateForm");
const premiumActivePanel = document.getElementById("premiumActivePanel");
const premiumLogoutButton = document.getElementById("premiumLogout");


// =====================================================
// PETICIONES AL WORKER CON TIEMPO LÍMITE
// =====================================================

async function premiumFetch(endpoint, options = {}) {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, PREMIUM_REQUEST_TIMEOUT);

    try {

        return await fetch(`${PREMIUM_API}${endpoint}`, {
            ...options,
            signal: controller.signal
        });

    } catch (error) {

        if (error.name === "AbortError") {
            throw new Error("El servidor tardó demasiado en responder. Intentá nuevamente.");
        }

        throw new Error("No se pudo conectar con el servidor PREMIUM. Revisá tu conexión.");

    } finally {

        clearTimeout(timeout);
    }
}


// =====================================================
// LEER RESPUESTA JSON
// =====================================================

async function premiumReadResponse(response) {

    try {

        return await response.json();

    } catch (error) {

        throw new Error("El servidor devolvió una respuesta inválida.");
    }
}


// =====================================================
// DISPOSITIVO
// =====================================================

function getPremiumDeviceId() {

    let deviceId = localStorage.getItem("prisioner0_device_id");

    if (!deviceId) {

        deviceId = window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : "dev-" + Date.now().toString(36) + "-" +
              Math.random().toString(36).substring(2, 12);

        localStorage.setItem("prisioner0_device_id", deviceId);
    }

    return deviceId;
}


// =====================================================
// GUARDAR SESIÓN PREMIUM
// =====================================================

function savePremiumSession(data) {

    if (!data?.session_token) {
        throw new Error("El servidor no devolvió un token de sesión.");
    }

    localStorage.setItem(PREMIUM_SESSION_KEY, data.session_token);
    localStorage.setItem(PREMIUM_CODE_KEY, data.code || "");
    localStorage.setItem(PREMIUM_EXPIRES_KEY, data.expires_at || "");
}


// =====================================================
// MENSAJES
// =====================================================

function showPremiumMessage(message, success = false) {

    if (!premiumMessage) return;

    premiumMessage.textContent = message;
    premiumMessage.style.color = success ? "#36d399" : "#ff6b6b";
}


// =====================================================
// MOSTRAR PANEL ACTIVO
// =====================================================

function showPremiumActive(expiresAt) {

    if (premiumActivateForm) {
        premiumActivateForm.style.display = "none";
    }

    const activationHeading = document.getElementById("premiumActivationHeading");

    if (activationHeading) {
        activationHeading.style.display = "none";
    }

    if (premiumActivePanel) {
        premiumActivePanel.style.display = "block";
    }

    const expiresElement = document.getElementById("premiumExpires");

    if (expiresElement) {
        expiresElement.textContent = formatPremiumDate(expiresAt);
    }

    updatePremiumRemaining(expiresAt);
}


// =====================================================
// FORMATO DE FECHA
// =====================================================

function formatPremiumDate(dateString) {

    if (!dateString) return "No disponible";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "No disponible";
    }

    return date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// =====================================================
// TIEMPO RESTANTE
// =====================================================

function updatePremiumRemaining(expiresAt) {

    const element = document.getElementById("premiumRemaining");

    if (!element || !expiresAt) return;

    const expiration = new Date(expiresAt).getTime();
    const remaining = expiration - Date.now();

    if (remaining <= 0) {
        element.textContent = "Membresía vencida";
        return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);

    element.textContent =
        `${days} días, ${hours} horas y ${minutes} minutos`;
}


// =====================================================
// VALIDAR SESIÓN PREMIUM
// =====================================================

async function checkPremiumSession() {

    const token = localStorage.getItem(PREMIUM_SESSION_KEY);

    if (!token) {
        showPremiumForm();
        return;
    }

    try {

        const response = await premiumFetch("/check-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_token: token
            })
        });

        const data = await premiumReadResponse(response);

        if (!response.ok) {
            throw new Error(data.error || "No se pudo comprobar la sesión.");
        }

        if (data.ok && data.premium === true) {

            const expiresAt =
                data.expires_at ||
                localStorage.getItem(PREMIUM_EXPIRES_KEY);

            localStorage.setItem(PREMIUM_EXPIRES_KEY, expiresAt || "");

            showPremiumActive(expiresAt);
            return;
        }

        clearPremiumSession();
        showPremiumForm();

    } catch (error) {

        console.error("Error comprobando PREMIUM:", error);

        showPremiumMessage(error.message || "No se pudo comprobar tu sesión.");
    }
}


// =====================================================
// MOSTRAR FORMULARIO
// =====================================================

function showPremiumForm() {

    if (premiumActivePanel) {
        premiumActivePanel.style.display = "none";
    }

    const activationHeading = document.getElementById("premiumActivationHeading");

    if (activationHeading) {
        activationHeading.style.display = "block";
    }

    if (premiumActivateForm) {
        premiumActivateForm.style.display = "block";
    }
}


// =====================================================
// LIMPIAR SESIÓN PREMIUM
// =====================================================

function clearPremiumSession() {

    localStorage.removeItem(PREMIUM_SESSION_KEY);
    localStorage.removeItem(PREMIUM_CODE_KEY);
    localStorage.removeItem(PREMIUM_EXPIRES_KEY);
}


// =====================================================
// MODAL PREMIUM DE CAMBIO DE DISPOSITIVO
// =====================================================

function showPremiumDeviceModal(data, deviceId) {

    const devices = data.premium?.devices || [];

    if (devices.length < 2) {
        showPremiumMessage("No se pudieron obtener los dos dispositivos registrados.");
        return;
    }

    // Evitar duplicar el modal.

    const previousOverlay = document.getElementById("premiumDeviceChangeOverlay");

    if (previousOverlay) {
        previousOverlay.remove();
    }

    // Crear fondo.

    const overlay = document.createElement("div");

    overlay.id = "premiumDeviceChangeOverlay";

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        zIndex: "2147483647",
        overflowY: "auto"
    });

    // Crear ventana.

    const modal = document.createElement("div");

    Object.assign(modal.style, {
        position: "relative",
        width: "100%",
        maxWidth: "430px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#171717",
        color: "#ffffff",
        border: "1px solid #444",
        borderRadius: "16px",
        padding: "28px 22px",
        boxSizing: "border-box",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 15px 60px rgba(0,0,0,0.7)"
    });

    const title = document.createElement("h3");

    title.textContent = "Límite de dispositivos";

    Object.assign(title.style, {
        color: "#ffffff",
        fontSize: "22px",
        margin: "8px 0 15px"
    });

    const icon = document.createElement("div");

    icon.textContent = "⚠️";

    Object.assign(icon.style, {
        fontSize: "42px",
        marginBottom: "10px"
    });

    const description = document.createElement("p");

    description.textContent =
        "Tu código PREMIUM ya está activo en 2 dispositivos.";

    Object.assign(description.style, {
        color: "#cccccc",
        fontSize: "15px",
        lineHeight: "1.5",
        marginBottom: "12px"
    });

    const instructions = document.createElement("p");

    instructions.textContent =
        "Tenés 1 cambio disponible. Elegí cuál dispositivo querés reemplazar:";

    Object.assign(instructions.style, {
        color: "#ffffff",
        fontSize: "14px",
        lineHeight: "1.5",
        marginBottom: "20px"
    });

    // Contenedor de dispositivos.

    const optionsContainer = document.createElement("div");

    Object.assign(optionsContainer.style, {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%"
    });

    // Mensaje interno del modal.

    const modalMessage = document.createElement("p");

    modalMessage.style.color = "#ff6b6b";
    modalMessage.style.fontSize = "13px";
    modalMessage.style.minHeight = "18px";
    modalMessage.style.margin = "12px 0";

    // Botón cancelar.

    const cancelButton = document.createElement("button");

    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";

    Object.assign(cancelButton.style, {
        width: "100%",
        padding: "13px",
        marginTop: "10px",
        border: "1px solid #555",
        borderRadius: "9px",
        background: "#292929",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer"
    });

    // Construir modal.

    modal.appendChild(icon);
    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(instructions);
    modal.appendChild(optionsContainer);
    modal.appendChild(modalMessage);
    modal.appendChild(cancelButton);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Evitar desplazamiento de la página de fondo.

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let changingDevice = false;

    function closeModal() {

        if (changingDevice) return;

        overlay.remove();
        document.body.style.overflow = previousBodyOverflow;
    }

    cancelButton.addEventListener("click", () => {

        closeModal();
        showPremiumMessage("Activación cancelada.");

    });

    // Crear una opción por cada dispositivo.

    devices.forEach((device, index) => {

        const button = document.createElement("button");

        button.type = "button";

        Object.assign(button.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: "100%",
            padding: "17px 12px",
            border: "1px solid #00a8ff",
            borderRadius: "10px",
            background: "#222831",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "14px"
        });

        const deviceIcon = document.createElement("span");

        deviceIcon.textContent = "📱";

        deviceIcon.style.fontSize = "25px";

        const deviceTitle = document.createElement("strong");

        deviceTitle.textContent = `Reemplazar dispositivo ${index + 1}`;

        const deviceDate = document.createElement("small");

        deviceDate.textContent =
            "Registrado: " + formatPremiumDate(device.created_at);

        deviceDate.style.color = "#bbbbbb";

        button.appendChild(deviceIcon);
        button.appendChild(deviceTitle);
        button.appendChild(deviceDate);

        button.addEventListener("click", async () => {

            if (changingDevice) return;

            changingDevice = true;

            optionsContainer.querySelectorAll("button").forEach(option => {
                option.disabled = true;
                option.style.opacity = "0.5";
                option.style.cursor = "wait";
            });

            cancelButton.disabled = true;

            cancelButton.style.opacity = "0.5";

            modalMessage.style.color = "#00a8ff";
            modalMessage.textContent = "Cambiando dispositivo...";

            try {

                const response = await premiumFetch("/change-device", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code: data.premium.code,
                        device_id: deviceId,
                        replace_session_id: device.id
                    })
                });

                const result = await premiumReadResponse(response);

                if (!response.ok || !result.ok) {

                    throw new Error(
                        result.error ||
                        result.mensaje ||
                        "No se pudo cambiar el dispositivo."
                    );
                }

                savePremiumSession(result.premium);

                overlay.remove();

                document.body.style.overflow = previousBodyOverflow;

                showPremiumMessage(
                    "¡Dispositivo cambiado y PREMIUM activado correctamente!",
                    true
                );

                showPremiumActive(result.premium.expires_at);

                if (premiumCodeInput) {
                    premiumCodeInput.value = "";
                }

            } catch (error) {

                console.error("Error cambiando dispositivo:", error);

                modalMessage.style.color = "#ff6b6b";
                modalMessage.textContent =
                    error.message || "No se pudo cambiar el dispositivo.";

                changingDevice = false;

                optionsContainer.querySelectorAll("button").forEach(option => {
                    option.disabled = false;
                    option.style.opacity = "1";
                    option.style.cursor = "pointer";
                });

                cancelButton.disabled = false;
                cancelButton.style.opacity = "1";
            }
        });

        optionsContainer.appendChild(button);
    });

    // Mostrar modal.

    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
    });

    console.log("PREMIUM: modal de cambio de dispositivo mostrado.");
}


// =====================================================
// ACTIVAR CÓDIGO PREMIUM
// =====================================================

if (premiumActivateButton) {

    premiumActivateButton.addEventListener("click", async () => {

        if (!premiumCodeInput) {
            showPremiumMessage("No se encontró el campo del código PREMIUM.");
            return;
        }

        const code = premiumCodeInput.value.trim().toUpperCase();

        if (!code) {
            showPremiumMessage("Ingresá tu código PREMIUM.");
            return;
        }

        if (!code.startsWith("PRIPRE-")) {
            showPremiumMessage("El código ingresado no es un código PREMIUM válido.");
            return;
        }

        premiumActivateButton.disabled = true;

        premiumActivateButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> ACTIVANDO...';

        showPremiumMessage("Verificando tu código...");

        try {

            const response = await premiumFetch("/activate-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code,
                    device_id: getPremiumDeviceId(),
                    domain: location.hostname
                })
            });

            const data = await premiumReadResponse(response);

            // IMPORTANTE:
            // El Worker devuelve HTTP 409 cuando corresponde
            // reemplazar uno de los dispositivos.

            if (data.requires_change === true) {

                showPremiumDeviceModal(data, getPremiumDeviceId());

                return;
            }

            if (!response.ok || !data.ok) {

                throw new Error(
                    data.error ||
                    data.mensaje ||
                    "No se pudo activar el código."
                );
            }

            savePremiumSession(data.premium);

            showPremiumMessage("¡PREMIUM activado correctamente!", true);

            showPremiumActive(data.premium.expires_at);

            premiumCodeInput.value = "";

        } catch (error) {

            console.error("Error activando PREMIUM:", error);

            showPremiumMessage(
                error.message || "Ocurrió un error al activar el código."
            );

        } finally {

            premiumActivateButton.disabled = false;

            premiumActivateButton.innerHTML =
                '<i class="fa-solid fa-unlock-keyhole"></i> ACTIVAR';

        }
    });
}


// =====================================================
// CERRAR SESIÓN PREMIUM
// =====================================================

if (premiumLogoutButton) {

    premiumLogoutButton.addEventListener("click", () => {

        clearPremiumSession();

        showPremiumForm();

        showPremiumMessage("Cerraste tu sesión PREMIUM.");

    });
}


// =====================================================
// INICIAR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    checkPremiumSession();

    const expiresAt = localStorage.getItem(PREMIUM_EXPIRES_KEY);

    if (expiresAt) {
        updatePremiumRemaining(expiresAt);
    }

    setInterval(() => {

        const currentExpiration =
            localStorage.getItem(PREMIUM_EXPIRES_KEY);

        if (currentExpiration) {
            updatePremiumRemaining(currentExpiration);
        }

    }, 60000);

});
