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
