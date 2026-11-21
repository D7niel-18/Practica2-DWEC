// Fase 7: validación de datos pura
function validarDatosPedido(datos) {
    const errores = {};

    // Nombre
    const nombre = datos.nombre.trim();

    if (nombre.length < 2 || nombre.length > 60) {
        errores.nombre = "El nombre debe tener entre 2 y 60 caracteres.";
    }

    // Email
    const email = datos.email.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email === "") {
        errores.email = "El email es obligatorio.";
    } else if (!regexEmail.test(email)) {
        errores.email = "Introduce un email válido.";
    }

    // Modalidad
    if (!["envio", "recogida"].includes(datos.modalidad)) {
        errores.modalidad = "Selecciona una modalidad válida.";
    }

    // Dirección y código postal
    if (datos.modalidad === "envio") {
        const direccion = datos.direccion.trim();

        if (direccion.length < 5 || direccion.length > 100) {
            errores.direccion = "La dirección debe tener entre 5 y 100 caracteres.";
        }

        const regexCodigoPostal = /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;

        if (!regexCodigoPostal.test(datos.codigoPostal)) {
            errores.codigoPostal = "Introduce un código postal válido.";
        }
    }

    // Observaciones
    if (datos.observaciones.length > 200) {
        errores.observaciones = "Las observaciones no pueden superar los 200 caracteres.";
    }

    // Aceptación
    if (!datos.aceptar) {
        errores.aceptar = "Debes aceptar las condiciones.";
    }

    return errores;
}
