/* =====================================================
   PRISIONER0 VIP
   Activación y sesión VIP
===================================================== */

const VIP_API =
    "https://prisioner0-vip-api.javiieergutierrez01.workers.dev";


// =====================================================
// OBTENER ID DEL DISPOSITIVO
// =====================================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem(
            "prisioner0_device_id"
        );

    if (!deviceId) {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            deviceId =
                window.crypto.randomUUID();

        } else {

            deviceId =
                "dev-" +
                Date.now().toString(36) +
                "-" +
                Math.random().toString(36).substring(2, 10) +
                "-" +
                Math.random().toString(36).substring(2, 10);

        }

        localStorage.setItem(
            "prisioner0_device_id",
            deviceId
        );
    }

    return deviceId;
}


// =====================================================
// GUARDAR SESIÓN VIP
// =====================================================

function saveVipSession(data) {

    localStorage.setItem(
        "prisioner0_vip_session",
        data.session_token
    );

    localStorage.setItem(
        "prisioner0_vip_code",
        data.code
    );

    localStorage.setItem(
        "prisioner0_vip_expires",
        data.expires_at
    );
}


// =====================================================
// MOSTRAR CARTEL DE CAMBIO
// =====================================================

function showDeviceChangeModal(data, deviceId) {

    const devices =
        data.vip?.devices || [];

    if (devices.length < 2) {

        vipMessage.textContent =
            "No se pudieron obtener tus dispositivos.";

        return;
    }


    // ================================================
    // CREAR FONDO
    // ================================================

    const overlay =
        document.createElement("div");

    overlay.id =
        "vipDeviceChangeOverlay";


    // ================================================
    // CREAR CARTEL
    // ================================================

    const modal =
        document.createElement("div");

    modal.className =
        "vip-device-modal";


    modal.innerHTML = `

        <div class="vip-device-modal-icon">
            ⚠️
        </div>

        <h3>
            Límite de dispositivos
        </h3>

        <p>
            Tu código VIP ya está activo
            en 2 dispositivos.
        </p>

        <p>
            Tenés <strong>1 cambio disponible</strong>.
            ¿Cuál dispositivo querés reemplazar?
        </p>

        <div class="vip-device-options">

            <button
                type="button"
                class="vip-device-option"
                data-session-id="${devices[0].id}"
            >

                <span>🖥️</span>

                <strong>
                    Dispositivo 1
                </strong>

                <small>
                    Registrado anteriormente
                </small>

            </button>


            <button
                type="button"
                class="vip-device-option"
                data-session-id="${devices[1].id}"
            >

                <span>🖥️</span>

                <strong>
                    Dispositivo 2
                </strong>

                <small>
                    Registrado anteriormente
                </small>

            </button>

        </div>


        <button
            type="button"
            class="vip-device-cancel"
            id="vipDeviceCancel"
        >
            Cancelar
        </button>

    `;


    overlay.appendChild(modal);

    document.body.appendChild(overlay);


    // =================================================
    // BOTONES DE DISPOSITIVOS
    // =================================================

    const buttons =
        modal.querySelectorAll(
            ".vip-device-option"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async function () {

                const sessionId =
                    Number(
                        this.dataset.sessionId
                    );

                await changeDevice(
                    data.vip.code,
                    deviceId,
                    sessionId,
                    overlay
                );

            }
        );

    });


    // =================================================
    // CANCELAR
    // =================================================

    document
        .getElementById("vipDeviceCancel")
        .addEventListener(
            "click",
            function () {

                overlay.remove();

                vipMessage.textContent =
                    "No se realizó ningún cambio.";

            }
        );

}


// =====================================================
// REALIZAR CAMBIO DE DISPOSITIVO
// =====================================================

async function changeDevice(
    code,
    deviceId,
    sessionId,
    overlay
) {

    const buttons =
        overlay.querySelectorAll(
            ".vip-device-option"
        );

    buttons.forEach(button => {

        button.disabled = true;

    });


    const cancelButton =
        overlay.querySelector(
            "#vipDeviceCancel"
        );

    if (cancelButton) {

        cancelButton.disabled = true;

    }


    try {

        const response =
            await fetch(
                `${VIP_API}/change-device`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        code: code,

                        device_id:
                            deviceId,

                        replace_session_id:
                            sessionId

                    })
                }
            );


        const data =
            await response.json();


        if (!data.ok) {

            alert(
                data.error ||
                "No se pudo cambiar el dispositivo."
            );

            buttons.forEach(button => {
                button.disabled = false;
            });

            if (cancelButton) {
                cancelButton.disabled = false;
            }

            return;
        }


        // =============================================
        // GUARDAR NUEVA SESIÓN
        // =============================================

        saveVipSession(
            data.vip
        );


        overlay.remove();


        vipMessage.textContent =
            "¡Dispositivo reemplazado correctamente!";

        vipMessage.style.color =
            "#7CFF8A";


    } catch (error) {

        console.error(
            "Error cambiando dispositivo:",
            error
        );

        alert(
            "No se pudo conectar con el Worker."
        );


        buttons.forEach(button => {
            button.disabled = false;
        });

        if (cancelButton) {
            cancelButton.disabled = false;
        }

    }

}


// =====================================================
// ACTIVAR VIP
// =====================================================

const activateButton =
    document.getElementById(
        "activateVip"
    );

const vipCodeInput =
    document.getElementById(
        "vipCode"
    );

const vipMessage =
    document.getElementById(
        "vipMessage"
    );


if (activateButton) {

    activateButton.addEventListener(
        "click",
        async function () {

            const code =
                vipCodeInput.value
                    .trim()
                    .toUpperCase();


            // ==========================================
            // CÓDIGO VACÍO
            // ==========================================

            if (!code) {

                vipMessage.textContent =
                    "Ingresá un código VIP.";

                return;

            }


            activateButton.disabled =
                true;


            vipMessage.textContent =
                "Comprobando código VIP...";


            vipMessage.style.color =
                "";


            try {

                const deviceId =
                    getDeviceId();


                console.log(
                    "CÓDIGO:",
                    code
                );

                console.log(
                    "DEVICE ID:",
                    deviceId
                );


                // ======================================
                // ACTIVAR
                // ======================================

                const response =
                    await fetch(
                        `${VIP_API}/activate-code`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                code:
                                    code,

                                device_id:
                                    deviceId

                            })
                        }
                    );


                const data =
                    await response.json();


                // ======================================
                // TIENE QUE ELEGIR DISPOSITIVO
                // ======================================

                if (
                    data.requires_change === true
                ) {

                    showDeviceChangeModal(
                        data,
                        deviceId
                    );

                    return;

                }


                // ======================================
                // ERROR NORMAL
                // ======================================

                if (!data.ok) {

                    vipMessage.textContent =
                        data.error ||
                        "No se pudo activar el código.";

                    vipMessage.style.color =
                        "";

                    return;

                }


                // ======================================
                // GUARDAR SESIÓN
                // ======================================

                saveVipSession(
                    data.vip
                );


                // ======================================
                // ÉXITO
                // ======================================

                vipMessage.textContent =
                    "¡Código VIP activado correctamente!";

                vipMessage.style.color =
                    "#7CFF8A";


            } catch (error) {

                console.error(
                    "Error VIP:",
                    error
                );

                vipMessage.textContent =
                    "No se pudo conectar con el Worker.";

                vipMessage.style.color =
                    "";

            } finally {

                activateButton.disabled =
                    false;

            }

        }
    );

}

// =====================================================
// LIMPIAR SESIÓN VIP
// =====================================================
function clearVipSession() {
    localStorage.removeItem(
        "prisioner0_vip_session"
    );

    localStorage.removeItem(
        "prisioner0_vip_code"
    );

    localStorage.removeItem(
        "prisioner0_vip_expires"
    );
}

// =====================================================
// MOSTRAR ESTADO VIP
// =====================================================

async function checkVipStatusPage() {

    const sessionToken =
        localStorage.getItem(
            "prisioner0_vip_session"
        );

    const activePanel =
        document.getElementById(
            "vipActivePanel"
        );

    const activateForm =
        document.getElementById(
            "vipActivateForm"
        );

    if (!activePanel || !activateForm) {
        return;
    }


    // =================================================
    // NO HAY SESIÓN VIP
    // =================================================

    if (!sessionToken) {

        activePanel.style.display =
            "none";

        activateForm.style.display =
            "block";

        return;
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


        // =================================================
        // VIP ACTIVO
        // =================================================

        if (
            data.ok === true &&
            data.vip === true
        ) {

            // Mostrar panel VIP
            activePanel.style.display =
                "block";


            // Ocultar formulario completo
            activateForm.style.display =
                "none";


            // =============================================
            // FECHA DE VENCIMIENTO
            // =============================================

            const expiresAt =
                data.vip.expires_at ||
                localStorage.getItem(
                    "prisioner0_vip_expires"
                );


            if (expiresAt) {

                const expiration =
                    new Date(
                        expiresAt
                    );


                const expiresElement =
                    document.getElementById(
                        "vipExpires"
                    );


                if (expiresElement) {

                    expiresElement.textContent =
                        expiration.toLocaleDateString(
                            "es-AR",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            }
                        );

                }


                // =========================================
                // TIEMPO RESTANTE
                // =========================================

                const now =
                    new Date();

                const difference =
                    expiration - now;


                const remainingElement =
                    document.getElementById(
                        "vipRemaining"
                    );


                if (remainingElement) {

                    if (difference > 0) {

                        const days =
                            Math.ceil(
                                difference /
                                (1000 * 60 * 60 * 24)
                            );


                        remainingElement.textContent =
                            `${days} día${days === 1 ? "" : "s"}`;

                    } else {

                        remainingElement.textContent =
                            "Expirado";

                    }

                }

            }

        }

        // =================================================
        // VIP NO VÁLIDO
        // =================================================

        else {
            clearVipSession();

            activePanel.style.display =
                "none";

            activateForm.style.display =
                "block";
        }

    } catch (error) {

        console.error(
            "Error comprobando estado VIP:",
            error
        );

    }

}
// =====================================================
// COMPROBAR AL CARGAR LA PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkVipStatusPage();

    }
);
// =====================================================
// CERRAR SESIÓN VIP
// =====================================================

const vipLogout =
    document.getElementById(
        "vipLogout"
    );

if (vipLogout) {

    vipLogout.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "¿Querés cerrar tu sesión VIP en este dispositivo?"
                );

            if (!confirmar) {
                return;
            }

            // =========================================
            // ELIMINAR SESIÓN LOCAL
            // =========================================

            localStorage.removeItem(
                "prisioner0_vip_session"
            );

            localStorage.removeItem(
                "prisioner0_vip_code"
            );

            localStorage.removeItem(
                "prisioner0_vip_expires"
            );

            // =========================================
            // RECARGAR
            // =========================================

            location.reload();

        }
    );

}