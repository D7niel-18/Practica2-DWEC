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

        const producto = catalogo.find(
            (producto) => producto.id === item.productoId
        );

        if (producto === undefined) {
            throw new Error("Producto no encontrado");
        }

        subtotal = subtotal + producto.precio * item.cantidad;
    }

    return Math.round(subtotal * 100) / 100;
}

function calcularDescuento(subtotal, porcentaje = 0) {

    if (subtotal < 0 || !Number.isFinite(subtotal)) {
        throw new Error("Subtotal no válido");
    }

    if (subtotal < SUBTOTAL_MINIMO_DESCUENTO) {
        return 0;
    }

    const descuento = subtotal * porcentaje;

    return Math.round(descuento * 100) / 100;
}

