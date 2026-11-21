// Fase 8: confirmación de pedido

// Comprobar el stock antes de confirmar
function comprobarStockCarrito(carrito, catalogo) {
    const lineasNoDisponibles = [];

    carrito.forEach((item) => {
        const producto = catalogo.find((producto) => {
            return producto.id === item.productoId;
        });

        // Comprobar si el producto existe y tiene stock suficiente
        if (!producto || !producto.comprobarDisponibilidad(item.cantidad)) {
            lineasNoDisponibles.push({
                productoId: item.productoId,
                nombre: producto ? producto.nombre : "Producto desconocido",
                solicitada: item.cantidad,
                disponible: producto ? producto.stock : 0
            });
        }
    });

    return lineasNoDisponibles;
}

// Crear el pedido
function crearPedido(datos) {
    const subtotal = calcularSubtotal(carrito, catalogo);
    const descuento = calcularDescuento(subtotal);
    const total = calcularTotal(subtotal, descuento);

    // Crear copias de las líneas del carrito
    const lineas = carrito.map((item) => {
        const producto = catalogo.find((producto) => {
            return producto.id === item.productoId;
        });

        return {
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: item.cantidad,
            subtotal: Math.round(producto.precio * item.cantidad * 100) / 100
        };
    });

    // Crear el objeto pedido
    const pedido = {
        id: Date.now(),
        fecha: new Date().toISOString(),

        cliente: {
            nombre: datos.nombre,
            email: datos.email
        },

        modalidad: datos.modalidad,

        direccion: datos.modalidad === "envio" ? datos.direccion : "",
        codigoPostal: datos.modalidad === "envio" ? datos.codigoPostal : "",

        observaciones: datos.observaciones,

        lineas: lineas,

        subtotal: subtotal,
        descuento: descuento,
        total: total
    };

    return pedido;
}

// Evento submit
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 1. Validar el formulario
    const errores = actualizarErroresFormulario();

    if (Object.keys(errores).length > 0 || !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 2. Comprobar que el carrito no esté vacío
    if (carrito.length === 0) {
        mostrarErrorFormulario("El carrito está vacío. Añade algún producto.");
        return;
    }

    // 3. Comprobar nuevamente el stock
    const lineasNoDisponibles = comprobarStockCarrito(carrito, catalogo);

    if (lineasNoDisponibles.length > 0) {

        let mensaje = "No hay stock suficiente para los siguientes productos: ";

        lineasNoDisponibles.forEach((item) => {
            mensaje += `${item.nombre} (solicitadas: ${item.solicitada}, disponibles: ${item.disponible}). `;
        });

        mostrarErrorFormulario(mensaje);
        return;
    }

    // Recoger los datos del formulario
    const datos = recogerDatosFormulario();

    // 4. Crear el pedido
    const pedido = crearPedido(datos);

    // 5. Descontar el stock
    carrito.forEach((item) => {
        const producto = catalogo.find((producto) => {
            return producto.id === item.productoId;
        });

        producto.descontarStock(item.cantidad);
    });

    // 6. Añadir el pedido al historial
    pedidos.push(pedido);
    // Limpiar exportación anterior
    document.querySelector("#json-historial").value = "";

    // 7. Vaciar el carrito sin reasignarlo
    carrito.splice(0, carrito.length);

    // 8. Reiniciar el formulario
    form.reset();

    // Actualizar manualmente los campos y el contador
    actualizarCamposEnvio();
    actualizarContador();
    limpiarErroresFormulario();

    // Limpiar mensajes
    ocultarErrorFormulario();

    // Mostrar mensaje de éxito
    const mensajeExito = document.querySelector("#mensaje-exito");

    mensajeExito.textContent = "¡Pedido realizado correctamente!";
    mensajeExito.hidden = false;

    // 9. Actualizar las vistas
    actualizarCatalogo();
    mostrarCarrito();
    mostrarHistorial();
});
