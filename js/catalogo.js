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
