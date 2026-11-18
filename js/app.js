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
const carrito = [{ productoId: 101, cantidad: 2 }];
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

/* FASE 3 */ 
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
    tarjeta.append(
        nombre,
        categoria,
        precio,
        existencias,
        acciones
    );

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
mostrarCatalogo(catalogo);
