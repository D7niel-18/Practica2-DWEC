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
