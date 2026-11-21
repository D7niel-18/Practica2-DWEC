// Fase 7: formulario (DOM y eventos)

// Referencia al formulario (se declara arriba porque lo usan todas las funciones de este fichero)
const form = document.querySelector("#form-pedido");

// Campos condicionales y contador
function actualizarCamposEnvio() {
    const modalidad = form.elements.namedItem("modalidad").value;

    const datosEnvio = document.querySelector("#datos-envio");
    const direccion = form.elements.namedItem("direccion");
    const codigoPostal = form.elements.namedItem("codigoPostal");

    const esEnvio = modalidad === "envio";

    datosEnvio.hidden = !esEnvio;

    direccion.required = esEnvio;
    codigoPostal.required = esEnvio;

    if (!esEnvio) {
        direccion.value = "";
        codigoPostal.value = "";

        direccion.setCustomValidity("");
        codigoPostal.setCustomValidity("");

        direccion.classList.remove("campo-invalido");
        codigoPostal.classList.remove("campo-invalido");

        document.querySelector("#error-direccion").textContent = "";
        document.querySelector("#error-codigo-postal").textContent = "";
    }
}

// Actualizar contador de observaciones
function actualizarContador() {
    const observaciones = form.elements.namedItem("observaciones");
    const contador = document.querySelector("#contador-observaciones");

    const longitud = observaciones.value.length;

    contador.textContent = `${longitud}/200`;

    contador.parentElement.classList.toggle("contador--limite", longitud >= 200);
}

// Recoger los datos del formulario
function recogerDatosFormulario() {
    const datosFormulario = new FormData(form);

    const modalidad = datosFormulario.get("modalidad") || "";

    return {
        nombre: datosFormulario.get("nombre") || "",
        email: datosFormulario.get("email") || "",
        modalidad: modalidad,

        direccion: modalidad === "recogida" ? "" : datosFormulario.get("direccion") || "",

        codigoPostal: modalidad === "recogida" ? "" : datosFormulario.get("codigoPostal") || "",

        observaciones: datosFormulario.get("observaciones") || "",
        aceptar: datosFormulario.get("aceptar") !== null
    };
}

function actualizarErroresFormulario() {
    const datos = recogerDatosFormulario();
    const errores = validarDatosPedido(datos);

    const campos = [
        "nombre",
        "email",
        "direccion",
        "codigoPostal",
        "observaciones",
        "aceptar"
    ];

    campos.forEach((campo) => {
        const control = form.elements.namedItem(campo);
        const nombreError = campo === "codigoPostal" ? "codigo-postal" : campo;
        const mensaje = document.querySelector(`#error-${nombreError}`);

        const error = errores[campo] || "";

        control.setCustomValidity(error);
        control.classList.toggle("campo-invalido", error !== "");

        if (mensaje) {
            mensaje.textContent = error;
        }
    });

    return errores;
}

// Funcs para mensajes generales
// Mostrar error general del formulario
function mostrarErrorFormulario(mensaje) {
    const error = document.querySelector("#error-formulario");

    error.textContent = mensaje;
    error.hidden = false;
}

// Ocultar error general del formulario
function ocultarErrorFormulario() {
    const error = document.querySelector("#error-formulario");

    error.textContent = "";
    error.hidden = true;
}

function limpiarErroresFormulario() {
    const campos = [
        "nombre",
        "email",
        "direccion",
        "codigoPostal",
        "observaciones",
        "aceptar"
    ];

    campos.forEach((campo) => {
        const control = form.elements.namedItem(campo);
        const nombreError = campo === "codigoPostal" ? "codigo-postal" : campo;
        const mensaje = document.querySelector(`#error-${nombreError}`);

        control.setCustomValidity("");
        control.classList.remove("campo-invalido");

        if (mensaje) {
            mensaje.textContent = "";
        }
    });
}

// Actualizar campos al cambiar la modalidad
form.addEventListener("change", () => {
    actualizarCamposEnvio();
    actualizarErroresFormulario();
});

form.addEventListener("input", () => {
    actualizarErroresFormulario();
});

form.elements.namedItem("observaciones").addEventListener("input", () => {
    actualizarContador();
});
