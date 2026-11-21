// Fase 6
function mostrarCarrito() {
    const contenedor = document.querySelector("#lineas-carrito");
    const mensajeVacio = document.querySelector("#mensaje-carrito-vacio");

    const totalUnidades = document.querySelector("#total-unidades");
    const vistaSubtotal = document.querySelector("#subtotal");
    const vistaDescuento = document.querySelector("#descuento");
    const vistaTotal = document.querySelector("#total");

    // Vaciar el contenedor para evitar duplicados
    contenedor.replaceChildren();

    // Mostrar u ocultar el mensaje de carrito vacío
    mensajeVacio.hidden = carrito.length !== 0;

    // Recorrer las líneas del carrito
    carrito.forEach((item) => {
        // Buscar el producto en el catálogo
        const producto = catalogo.find((producto) => producto.id === item.productoId);

        if (!producto) {
            throw new Error("Producto no encontrado en el catálogo");
        }

        const linea = document.createElement("article");
        linea.classList.add("linea-carrito");

        // Guardar el id para poder retirar la línea
        linea.dataset.productoId = item.productoId;

        const nombre = document.createElement("p");
        nombre.classList.add("linea-carrito__nombre");
        nombre.textContent = producto.nombre;

        const cantidad = document.createElement("p");
        cantidad.textContent = item.cantidad;

        const precio = document.createElement("p");
        precio.textContent = producto.precio.toFixed(2) + " €";

        const subtotalLinea = document.createElement("p");
        subtotalLinea.textContent =
            (producto.precio * item.cantidad).toFixed(2) + " €";

        const botonRetirar = document.createElement("button");
        botonRetirar.type = "button";
        botonRetirar.classList.add("boton-peligro");
        botonRetirar.textContent = "Retirar";

        linea.append(nombre, cantidad, precio, subtotalLinea, botonRetirar);

        contenedor.append(linea);
    });

    // Calcular el total de unidades
    const unidades = carrito.reduce((total, item) => {
        return total + item.cantidad;
    }, 0);

    // Utilizar las funciones de cálculo existentes
    const subtotal = calcularSubtotal(carrito, catalogo);
    const descuento = calcularDescuento(subtotal);
    const total = calcularTotal(subtotal, descuento);

    // Actualizar el resumen
    totalUnidades.textContent = unidades;
    vistaSubtotal.textContent = subtotal.toFixed(2) + " €";
    vistaDescuento.textContent = descuento.toFixed(2) + " €";
    vistaTotal.textContent = total.toFixed(2) + " €";
}

// Función para mostrar errores
function mostrarErrorCarrito(mensaje) {
    const error = document.querySelector("#error-carrito");

    error.textContent = mensaje;
    error.hidden = false;
}

// Función para ocultar errores
function ocultarErrorCarrito() {
    const error = document.querySelector("#error-carrito");

    error.textContent = "";
    error.hidden = true;
}

const listaProductos = document.querySelector("#lista-productos");

listaProductos.addEventListener("click", (event) => {

    // Comprobar si se ha pulsado el botón de añadir
    const boton = event.target.closest(".boton-anadir");

    if (!boton || !listaProductos.contains(boton)) {
        return;
    }

    // Obtener la tarjeta del producto
    const tarjeta = boton.closest(".tarjeta");

    // Obtener el id y convertirlo a número
    const productoId = Number(tarjeta.dataset.productoId);

    // Buscar el producto en el catálogo
    const producto = catalogo.find((producto) => producto.id === productoId);

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    // Obtener la cantidad introducida
    const inputCantidad = tarjeta.querySelector('input[type="number"]');
    const cantidad = inputCantidad.valueAsNumber;

    // Validar que no esté vacío
    if (Number.isNaN(cantidad)) {
        mostrarErrorCarrito("Introduce una cantidad.");
        return;
    }

    // Validar que sea un número entero
    if (!Number.isInteger(cantidad)) {
        mostrarErrorCarrito("La cantidad debe ser un número entero.");
        return;
    }

    // Validar que sea mayor que cero
    if (cantidad <= 0) {
        mostrarErrorCarrito("La cantidad debe ser mayor que cero.");
        return;
    }

    // Comprobar si el producto ya está en el carrito
    const lineaExistente = carrito.find((item) => item.productoId === productoId);

    // Obtener la cantidad que ya hay en el carrito
    const cantidadActual = lineaExistente ? lineaExistente.cantidad : 0;

    // Sumar la cantidad nueva a la existente
    const cantidadAcumulada = cantidadActual + cantidad;

    // Comprobar la disponibilidad total
    if (!producto.comprobarDisponibilidad(cantidadAcumulada)) {
        mostrarErrorCarrito(
            `Stock insuficiente. Solo quedan ${producto.stock - cantidadActual} unidades disponibles.`
        );
        return;
    }

    // Si ya existe la línea, sumar la cantidad
    if (lineaExistente) {
        lineaExistente.cantidad += cantidad;
    } else {
        // Si no existe, crear una nueva línea
        carrito.push({
            productoId: productoId,
            cantidad: cantidad
        });
    }

    // Ocultar errores y actualizar el carrito
    ocultarErrorCarrito();
    mostrarCarrito();
});

// Retirar líneas del carrito
const lineasCarrito = document.querySelector("#lineas-carrito");

lineasCarrito.addEventListener("click", (event) => {

    // Comprobar si se ha pulsado el botón de retirar
    const boton = event.target.closest(".boton-peligro");

    if (!boton || !lineasCarrito.contains(boton)) {
        return;
    }

    // Obtener la línea del carrito
    const linea = boton.closest(".linea-carrito");

    // Obtener el id y convertirlo a número
    const productoId = Number(linea.dataset.productoId);

    // Buscar la posición de la línea
    const indice = carrito.findIndex(
        (item) => item.productoId === productoId
    );

    if (indice === -1) {
        return;
    }

    // Eliminar la línea del array
    carrito.splice(indice, 1);

    // Actualizar la vista
    mostrarCarrito();
});
