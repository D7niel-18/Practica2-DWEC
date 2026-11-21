// Fase 9: historial y exportación

// Filtrar pedidos por modalidad
function filtrarPedidos(pedidos, modalidad) {
    return pedidos.filter((pedido) => {
        return modalidad === "todos" || pedido.modalidad === modalidad;
    });
}

// Calcular resumen del historial
function calcularResumenHistorial(pedidos) {

    const numeroPedidos = pedidos.length;
    const importeTotal = pedidos.reduce((total, pedido) => { return total + pedido.total;}, 0);

    return {
        numeroPedidos: numeroPedidos,
        importeTotal: Math.round(importeTotal * 100) / 100
    };
}

// Crear tarjeta de un pedido
function crearTarjetaPedido(pedido) {

    const tarjeta = document.createElement("article");
    tarjeta.classList.add("pedido");

    // Resumen del pedido
    const resumen = document.createElement("div");
    resumen.classList.add("pedido__resumen");

    const numero = document.createElement("h3");
    numero.textContent = "Pedido #" + pedido.id;

    const fecha = document.createElement("p");
    fecha.textContent = "Fecha: " + new Date(pedido.fecha).toLocaleString("es-ES");

    const cliente = document.createElement("p");
    cliente.textContent = "Cliente: " + pedido.cliente.nombre;

    const modalidad = document.createElement("p");
    modalidad.textContent = "Modalidad: " + pedido.modalidad;

    const total = document.createElement("p");
    total.textContent = "Total: " + pedido.total.toFixed(2) + " €";

    resumen.append(numero, fecha, cliente, modalidad, total);

    // Detalle desplegable
    const detalle = document.createElement("details");
    detalle.classList.add("pedido__detalle");

    const tituloDetalle = document.createElement("summary");
    tituloDetalle.textContent = "Ver detalle del pedido";

    detalle.append(tituloDetalle);

    // Recorrer las líneas del pedido
    pedido.lineas.forEach((item) => {

        const linea = document.createElement("p");

        linea.textContent =
            `${item.nombre} - ${item.cantidad} unidades - ` +
            `${item.precio.toFixed(2)} € - ${item.subtotal.toFixed(2)} €`;

        detalle.append(linea);
    });

    tarjeta.append(resumen, detalle);

    return tarjeta;
}

// Mostrar historial
function mostrarHistorial() {

    const filtro = document.querySelector("#filtro-modalidad");
    const listaPedidos = document.querySelector("#lista-pedidos");
    const mensajeVacio = document.querySelector("#mensaje-historial-vacio");

    const numeroPedidos = document.querySelector("#numero-pedidos");
    const importeHistorial = document.querySelector("#importe-historial");

    // Comprobar que la modalidad sea válida
    const modalidadesValidas = ["todos", "recogida", "envio"];

    if (!modalidadesValidas.includes(filtro.value)) {
        filtro.value = "todos";
    }

    // Filtrar pedidos
    const pedidosFiltrados = filtrarPedidos(pedidos, filtro.value);

    // Calcular resumen de los pedidos filtrados
    const resumen = calcularResumenHistorial(pedidosFiltrados);

    // Vaciar el historial anterior
    listaPedidos.replaceChildren();

    // Actualizar resumen
    numeroPedidos.textContent = resumen.numeroPedidos;
    importeHistorial.textContent = resumen.importeTotal.toFixed(2) + " €";

    // Comprobar si no hay ningún pedido
    if (pedidos.length === 0) {
        mensajeVacio.textContent = "Todavía no hay pedidos en el historial.";
        mensajeVacio.hidden = false;
        return;
    }

    // Comprobar si el filtro no encuentra resultados
    if (pedidosFiltrados.length === 0) {
        mensajeVacio.textContent = "No hay pedidos con esta modalidad.";
        mensajeVacio.hidden = false;
        return;
    }

    mensajeVacio.hidden = true;

    // Crear y mostrar cada pedido
    pedidosFiltrados.forEach((pedido) => {

        const tarjeta = crearTarjetaPedido(pedido);

        listaPedidos.append(tarjeta);
    });
}

// Exportar historial
function exportarHistorial() {
    const jsonHistorial = document.querySelector("#json-historial");

    jsonHistorial.value = JSON.stringify(pedidos, null, 4);
}

// Evento para filtrar el historial
const filtroModalidad = document.querySelector("#filtro-modalidad");

filtroModalidad.addEventListener("change", () => {
    mostrarHistorial();
});

// Evento para exportar el historial
const botonExportar = document.querySelector("#exportar-historial");

botonExportar.addEventListener("click", () => {
    exportarHistorial();
});
