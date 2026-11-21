// Colecciones
const datosProductos = [

    // Electrónica
    { id: 101, nombre: "Ratón USB", categoria: "electronica", precio: 12.5, stock: 8 },
    { id: 102, nombre: "Teclado", categoria: "electronica", precio: 24.9, stock: 0 },

    // Informática
    { id: 103, nombre: "Monitor", categoria: "informatica", precio: 129.9, stock: 5 },
    { id: 104, nombre: "Webcam", categoria: "informatica", precio: 45, stock: 10 },

    // Hogar
    { id: 105, nombre: "Lámpara", categoria: "hogar", precio: 18.5, stock: 6 },
    { id: 106, nombre: "Silla", categoria: "hogar", precio: 85, stock: 3 }

];
// Linea de prueba --> const carrito = [{ productoId: 101, cantidad: 2 }];
const carrito = [];
const pedidos = [];


// Clase Producto
class Producto {
    constructor(id, nombre, categoria, precio, stock) {
        // Validaciones en el constructor ya que es es el encargado de crear e inicializar los objetos de una clase.
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID no válido");
        }

        if (typeof nombre !== "string" || nombre.trim() === "") {
            throw new Error("Nombre no válido");
        }

        if (!["electronica", "informatica", "hogar"].includes(categoria)) {
            throw new Error("Categoría no válida");
        }

        if (typeof precio !== "number" || !Number.isFinite(precio) || precio <= 0) {
            throw new Error("Precio no válido");
        }

        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error("Stock no válido");
        }

        this.id = id;
        this.nombre = nombre.trim();
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }
    // Metodos
    comprobarDisponibilidad(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0){
            return false;
        }

        if (this.stock >= cantidad) {
            return true;
        }

        return false;
    }
    descontarStock(cantidad) {
        if (this.comprobarDisponibilidad(cantidad)) {
            this.stock = this.stock - cantidad;
            return true;
        }

        return false;
    }
}
//  Crear el catálogo con map
const catalogo = datosProductos.map((producto) => {
    return new Producto(
        producto.id,
        producto.nombre,
        producto.categoria,
        producto.precio,
        producto.stock
    );
});

// Fase 3
const SUBTOTAL_MINIMO_DESCUENTO = 100;
const PORCENTAJE_DESCUENTO = 0.1;

function calcularSubtotal(carrito, catalogo) {

    let subtotal = 0;

    for (const item of carrito) {

        const producto = catalogo.find((producto) => producto.id === item.productoId);

        if (producto === undefined) {
            throw new Error("Producto no encontrado");
        }

        subtotal = subtotal + producto.precio * item.cantidad;
    }

    return Math.round(subtotal * 100) / 100;
}

// El porcentaje es una fracción: 0.1 equivale al 10 %.
function calcularDescuento(subtotal, porcentaje = PORCENTAJE_DESCUENTO) {

    if (subtotal < 0 || !Number.isFinite(subtotal)) {
        throw new Error("Subtotal no válido");
    }

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 1) {
        throw new Error("Porcentaje de descuento no válido");
    }

    if (subtotal < SUBTOTAL_MINIMO_DESCUENTO) {
        return 0;
    }

    const descuento = subtotal * porcentaje;

    return Math.round(descuento * 100) / 100;
}

function calcularTotal(subtotal, descuento) {

    if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(descuento) || descuento < 0) {
        throw new Error("Importes no válidos");
    }

    return Math.round((subtotal - descuento) * 100) / 100;
}

// Fase 4
function crearTarjetaProducto(producto) {

    // Crear tarjeta
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    // Guardar el id del producto
    tarjeta.dataset.productoId = producto.id;

    // Nombre
    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    // Categoría
    const categoria = document.createElement("p");
    categoria.classList.add("tarjeta__categoria");
    categoria.textContent = producto.categoria;

    // Precio
    const precio = document.createElement("p");
    precio.classList.add("tarjeta__precio");
    precio.textContent = producto.precio.toFixed(2) + " €";

    // Existencias
    const existencias = document.createElement("p");
    existencias.classList.add("tarjeta__stock");
    existencias.textContent = "Existencias: " + producto.stock;

    // Label de cantidad
    const labelCantidad = document.createElement("label");
    labelCantidad.textContent = "Cantidad:";
    labelCantidad.htmlFor = "cantidad-" + producto.id;

    // Input de cantidad
    const cantidad = document.createElement("input");
    cantidad.type = "number";
    cantidad.id = "cantidad-" + producto.id;
    cantidad.min = 1;
    cantidad.max = producto.stock;
    cantidad.value = producto.stock > 0 ? 1 : 0;

    // Botón
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Añadir al carrito";
    // Boton [clase] --> Añadir productos al carrito
    boton.classList.add("boton-anadir");

    // Contenedor de acciones
    const acciones = document.createElement("div");
    acciones.classList.add("tarjeta__acciones");

    // Comprobar si está agotado
    if (producto.stock === 0) {

        tarjeta.classList.add("tarjeta--agotada");

        existencias.textContent = "Producto agotado";
        existencias.classList.add("etiqueta-agotado");

        cantidad.disabled = true;
        boton.disabled = true;

        boton.textContent = "Agotado";
    }

    // Añadir label, input y botón al contenedor
    acciones.append(labelCantidad, cantidad, boton);

    // Añadir elementos a la tarjeta
    tarjeta.append(nombre, categoria, precio, existencias, acciones);

    return tarjeta;
}

function mostrarCatalogo(productos) {

    const listaProductos = document.querySelector("#lista-productos");
    const mensajeSinResultados = document.querySelector("#mensaje-sin-resultados");

    // Vaciar catálogo anterior
    listaProductos.replaceChildren();

    // Comprobar si hay productos
    if (productos.length === 0) {
        mensajeSinResultados.hidden = false;
        return;
    }

    mensajeSinResultados.hidden = true;

    // Crear una tarjeta por cada producto
    productos.forEach((producto) => {

        const tarjeta = crearTarjetaProducto(producto);

        listaProductos.append(tarjeta);
    });
}

// Fase 5

// Normalizar texto
function normalizarTexto(texto) {
    return texto.trim().toLowerCase()
}

// Filtrar productos
function filtrarProductos(catalogo, texto, categoria) {
    const textoNormalizado = normalizarTexto(texto);

    const productosFiltrados = catalogo.filter((producto) => {
        const nombre = normalizarTexto(producto.nombre);

        const coincideNombre = nombre.includes(textoNormalizado);

        const coincideCategoria = categoria === "todas" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    return productosFiltrados;
}

// Actualizar catálogo
function actualizarCatalogo() {
    const texto = document.querySelector("#busqueda").value;
    const categoria = document.querySelector("#categoria").value;

    const productosFiltrados = filtrarProductos(catalogo, texto, categoria);

    mostrarCatalogo(productosFiltrados);
}

// Eventos de búsqueda y categoría
const busqueda = document.querySelector("#busqueda");
const selectCategoria = document.querySelector("#categoria");

// input: actualiza los resultados mientras escribes.
busqueda.addEventListener("input", () => {
    actualizarCatalogo();
});

// change: actualiza los resultados cuando cambias la categoría.
selectCategoria.addEventListener("change", () => {
    actualizarCatalogo();
});

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

// Fase 7

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

// Validacion de datos pura
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

// Recoger los datos del formulario
const form = document.querySelector("#form-pedido");

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

// Fase 8

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
    function crearID() {
        let id = Math.floor(Math.random() * 1000000) + 1;

        while (pedidos.some(pedido => pedido.id === id)) {
            id = Math.floor(Math.random() * 1000000) + 1;
        }

        return id;
    }
    const pedido = {
        id: crearID(),
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

// Fase 9

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

// Arranque
actualizarCamposEnvio();
actualizarContador();

mostrarCatalogo(catalogo);
mostrarCarrito();
mostrarHistorial();