# Práctica DWEC – Gestión de catálogo, carrito y pedidos

**Autor:** [Daniel Jimenez Ramirez]
**IA:** [[Claude: Practica 2 DWEC](https://claude.ai/share/d59bbb86-fa60-4298-8ab7-875529a71af9)]

## 1. Descripción del proyecto

Aplicación web desarrollada con HTML, CSS y JavaScript que permite gestionar un catálogo de productos, realizar compras mediante un carrito y confirmar pedidos.

La aplicación permite buscar y filtrar productos, controlar el stock disponible, calcular descuentos y consultar el historial de pedidos. También permite exportar dicho historial en formato JSON.

## 2. Tecnologías utilizadas

- HTML5: estructura de la aplicación.
- CSS3: diseño y presentación.
- JavaScript: lógica y funcionalidades.
- JSON: formato de exportación del historial.
- Navegador web: ejecución y pruebas de la aplicación.

## 3. Estructura de carpetas

```text
proyecto/
│
├── index.html
├── README.md
│
├── css/
│   └── estilos.css
│
├── js/
│   ├── producto.js
│   ├── datos.js
│   ├── calculos.js
│   ├── validacion.js
│   ├── catalogo.js
│   ├── carrito.js
│   ├── formulario.js
│   ├── pedidos.js
│   ├── historial.js
│   └── app.js
│
└── evidencias/
    ├── depuracion.png
    └── network.png
```

### 3.1. Descripción de los ficheros

- `index.html`: contiene la estructura HTML de las cuatro secciones (catálogo, carrito, formulario de pedido e historial) y carga los scripts.
- `css/estilos.css`: contiene los estilos visuales de la aplicación y las clases de utilidad.
- `evidencias/`: capturas de pantalla de la depuración y de la pestaña Network.
- `README.md`: documentación del proyecto, instrucciones y pruebas realizadas.

### 3.2. Ficheros JavaScript

La lógica se ha dividido en varios ficheros, cada uno con una responsabilidad concreta.

**`js/producto.js`**
Define la clase `Producto`. El constructor valida los datos (id entero positivo, nombre no vacío, categoría admitida, precio finito mayor que cero y stock entero no negativo) y lanza un error si alguno es incorrecto. Incluye dos métodos que usan `this`: `comprobarDisponibilidad(cantidad)`, que indica si hay stock suficiente para una cantidad válida, y `descontarStock(cantidad)`, que resta esa cantidad solo si la comprobación anterior es correcta.

**`js/datos.js`**
Contiene las tres colecciones en memoria. `datosProductos` es el array de objetos de partida, `catalogo` es el resultado de convertirlos en instancias de `Producto` con `map`, y `carrito` y `pedidos` son arrays que empiezan vacíos. Depende de `producto.js`.

**`js/calculos.js`**
Reúne los cálculos económicos, que son funciones puras: no leen ni modifican el DOM, reciben los datos por parámetros y devuelven un número. Incluye las constantes `SUBTOTAL_MINIMO_DESCUENTO` (100) y `PORCENTAJE_DESCUENTO` (0.1) y las funciones `calcularSubtotal`, `calcularDescuento` (con parámetro por defecto) y `calcularTotal`.

**`js/validacion.js`**
Contiene `validarDatosPedido(datos)`, también una función pura. Recibe un objeto con los datos del formulario y devuelve un objeto con un mensaje de error por cada campo incorrecto. Aquí está la expresión regular del código postal, con agrupación y alternativas.

**`js/catalogo.js`**
Se ocupa de mostrar los productos y de filtrarlos. `crearTarjetaProducto` construye cada tarjeta con `createElement` y `textContent`, `mostrarCatalogo` la pinta, `filtrarProductos` (pura) combina búsqueda y categoría en un solo `filter` y `actualizarCatalogo` lee los controles y repinta. Registra los eventos `input` del buscador y `change` de la categoría.

**`js/carrito.js`**
Gestiona el carrito. `mostrarCarrito` pinta las líneas y el resumen con los totales, y `mostrarErrorCarrito` y `ocultarErrorCarrito` controlan los mensajes de error. Registra dos listeners con delegación de eventos: uno en `#lista-productos` para añadir productos y otro en `#lineas-carrito` para retirar líneas.

**`js/formulario.js`**
Gestiona el formulario del pedido. Declara la referencia `form` y contiene `actualizarCamposEnvio` (muestra u oculta los campos de envío y cambia su obligatoriedad), `actualizarContador`, `recogerDatosFormulario` (usa `FormData`), `actualizarErroresFormulario` (usa la Constraint Validation API), `mostrarErrorFormulario`, `ocultarErrorFormulario` y `limpiarErroresFormulario`. Registra los eventos `change` e `input` del formulario y el `input` de las observaciones.

**`js/pedidos.js`**
Contiene la confirmación del pedido. `comprobarStockCarrito` (pura) devuelve las líneas que no tienen stock suficiente, `crearID` genera un identificador no repetido, `crearPedido` construye el objeto pedido con copias de las líneas y el evento `submit` coordina todo el proceso. Depende de `form`, que se define en `formulario.js`.

**`js/historial.js`**
Gestiona el historial. `filtrarPedidos` y `calcularResumenHistorial` son funciones puras, `crearTarjetaPedido` construye cada pedido con su detalle desplegable, `mostrarHistorial` actualiza la vista con los estados vacíos diferenciados y `exportarHistorial` escribe el JSON en el textarea. Registra el evento `change` del filtro y el `click` del botón de exportar.

**`js/app.js`**
Contiene únicamente el arranque: las primeras llamadas de pintado y de preparación del formulario. Debe cargarse el último, porque necesita todas las funciones y colecciones anteriores.

### 3.3. Orden de carga

Los scripts se cargan desde `index.html` con `defer`, en este orden:

```html
<script src="js/producto.js" defer></script>
<script src="js/datos.js" defer></script>
<script src="js/calculos.js" defer></script>
<script src="js/validacion.js" defer></script>
<script src="js/catalogo.js" defer></script>
<script src="js/carrito.js" defer></script>
<script src="js/formulario.js" defer></script>
<script src="js/pedidos.js" defer></script>
<script src="js/historial.js" defer></script>
<script src="js/app.js" defer></script>
```

Los scripts con `defer` se descargan en paralelo, pero se ejecutan cuando el HTML está analizado y en el orden en que aparecen. El orden importa porque cada fichero usa lo definido en los anteriores. Se han utilizado scripts clásicos y no módulos ES para que todas las funciones y colecciones sigan accesibles desde la consola de DevTools, donde se ejecutan algunas pruebas.

## 4. Instrucciones de ejecución

La aplicación debe ejecutarse mediante un servidor HTTP local. (Live Server)

### Visual Studio Code

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar la extensión Live Server si no está instalada.
3. Abrir el archivo `index.html`.
4. Pulsar con el botón derecho y seleccionar **Open with Live Server**.
5. La aplicación se abrirá en el navegador mediante una dirección HTTP local.

## 5. Funcionalidades implementadas

### 5.1. Creación de productos y catálogo

**Ficheros:** `index.html`, `js/producto.js`, `js/datos.js`, `js/catalogo.js`

**Clase:**
- `Producto`: representa cada producto, valida sus datos en el constructor y comprueba su disponibilidad de stock.

**Funciones:**
- `crearTarjetaProducto(producto)`: crea la tarjeta HTML de un producto.
- `mostrarCatalogo(productos)`: muestra los productos en el catálogo.

Los productos se almacenan inicialmente en el array `datosProductos` y se convierten en instancias de la clase `Producto`, que se guardan en `catalogo`. Los productos sin stock se muestran, pero con el campo de cantidad y el botón desactivados.

### 5.2. Búsqueda y filtrado

**Ficheros:** `index.html`, `js/catalogo.js`

**Funciones:**
- `normalizarTexto(texto)`: elimina los espacios exteriores y pasa el texto a minúsculas para facilitar las búsquedas.
- `filtrarProductos(catalogo, texto, categoria)`: filtra los productos por nombre y categoría. Es una función pura.
- `actualizarCatalogo()`: recoge los valores de los campos de búsqueda y actualiza el catálogo.

La búsqueda se realiza dinámicamente al escribir y al cambiar la categoría seleccionada. Ignora mayúsculas y minúsculas, pero no normaliza las tildes.

### 5.3. Cálculo del carrito

**Ficheros:** `index.html`, `js/calculos.js`, `js/carrito.js`

**Funciones:**
- `calcularSubtotal(carrito, catalogo)`: calcula el importe de los productos del carrito.
- `calcularDescuento(subtotal, porcentaje = PORCENTAJE_DESCUENTO)`: calcula el importe del descuento.
- `calcularTotal(subtotal, descuento)`: calcula el importe final.
- `mostrarCarrito()`: actualiza las líneas y el resumen del carrito.

El descuento aplicado es del 10 % cuando el subtotal alcanza o supera los 100 €. Los importes se redondean a dos decimales con operaciones numéricas y solo se formatean con `toFixed(2)` al mostrarlos.

### 5.4. Añadir y eliminar productos

**Ficheros:** `index.html`, `js/producto.js`, `js/carrito.js`

**Funciones y métodos:**
- `comprobarDisponibilidad(cantidad)` (método de `Producto`): comprueba si existe stock suficiente.
- Listener de `#lista-productos`: gestiona el clic de los botones de añadir mediante delegación de eventos.
- Listener de `#lineas-carrito`: gestiona el clic de los botones de retirar mediante delegación de eventos.
- `mostrarCarrito()`: actualiza la representación del carrito.
- `mostrarErrorCarrito()` y `ocultarErrorCarrito()`: muestran y ocultan los errores relacionados con el carrito.

Los productos se añaden mediante eventos de clic en los botones del catálogo. Si el producto ya está en el carrito, se suma la cantidad a su línea. También se pueden eliminar líneas completas del carrito.

La cantidad solicitada se valida (no vacía, entera, mayor que cero) y se comprueba contra el stock sumando lo que ya hay en el carrito, de modo que no se puede superar el stock disponible. Añadir al carrito no descuenta existencias.

### 5.5. Formulario y validación

**Ficheros:** `index.html`, `js/validacion.js`, `js/formulario.js`

**Funciones:**
- `actualizarCamposEnvio()`: muestra u oculta los campos de envío y modifica su obligatoriedad.
- `actualizarContador()`: actualiza el contador de caracteres de las observaciones.
- `validarDatosPedido(datos)`: comprueba los datos introducidos. Es una función pura.
- `actualizarErroresFormulario()`: muestra los errores de validación asociados a cada campo.
- `recogerDatosFormulario()`: recoge los datos del formulario con `FormData`.
- `limpiarErroresFormulario()`: elimina los errores después de confirmar el pedido.

Se validan el nombre, el correo electrónico, la modalidad de entrega, la dirección, el código postal, las observaciones y la aceptación de las condiciones. Se combinan las restricciones HTML5 con la validación en JavaScript y la Constraint Validation API.

El código postal se comprueba con `RegExp.test()` y esta expresión, cuyas alternativas cubren las provincias 01 a 09, 10 a 49 y 50 a 52:

```text
/^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/
```

### 5.6. Confirmación de pedidos y control del stock

**Ficheros:** `index.html`, `js/pedidos.js`, `js/formulario.js`, `js/producto.js`

**Funciones:**
- `comprobarStockCarrito(carrito, catalogo)`: comprueba que todos los productos tengan stock suficiente.
- `crearID()`: genera un identificador que no esté repetido entre los pedidos existentes.
- `crearPedido(datos)`: construye el objeto que representa el pedido.
- `mostrarErrorFormulario()` y `ocultarErrorFormulario()` (en `formulario.js`): muestran y ocultan los errores generales.
- `descontarStock(cantidad)` (método de `Producto`): descuenta el stock una vez confirmado el pedido.

Al confirmar un pedido, se valida el formulario, se comprueba que el carrito no esté vacío y que exista stock suficiente. Si todo es correcto, se crea el pedido, se descuenta el stock, se añade al historial, se vacía el carrito y se reinicia el formulario. Si algo falla antes, no se modifica ninguna colección y el formulario conserva lo escrito.

Las líneas del pedido guardan copias del nombre y del precio de ese momento, por lo que el historial no cambia aunque cambie después el catálogo.

### 5.7. Historial de pedidos y exportación JSON

**Ficheros:** `index.html`, `js/historial.js`

**Funciones:**
- `filtrarPedidos(pedidos, modalidad)`: filtra los pedidos según su modalidad.
- `calcularResumenHistorial(pedidos)`: calcula el número de pedidos y el importe acumulado.
- `crearTarjetaPedido(pedido)`: crea la tarjeta de cada pedido y permite consultar sus detalles.
- `mostrarHistorial()`: actualiza el historial y su resumen.
- `exportarHistorial()`: exporta todos los pedidos en formato JSON.

El historial permite consultar los pedidos realizados y filtrarlos por recogida o envío. El número de pedidos y el importe se calculan sobre los pedidos filtrados. También permite exportar el historial completo, y con el historial vacío muestra `[]`.

---

## 6. Casos de prueba reproducibles

Las siguientes pruebas deben realizarse desde la interfaz de la aplicación, utilizando el navegador.

**Importante:** para repetir las pruebas que modifican el stock o el historial, recargar la aplicación para recuperar los datos iniciales, ya que los datos se almacenan únicamente en memoria.

Datos iniciales del catálogo:

| id | Producto | Categoría | Precio | Stock |
|---|---|---|---|---|
| 101 | Ratón USB | electronica | 12,50 € | 8 |
| 102 | Teclado | electronica | 24,90 € | 0 |
| 103 | Monitor | informatica | 129,90 € | 5 |
| 104 | Webcam | informatica | 45,00 € | 10 |
| 105 | Lámpara | hogar | 18,50 € | 6 |
| 106 | Silla | hogar | 85,00 € | 3 |

### 6.1. Catálogo y búsqueda

**Prueba 1: Mostrar el catálogo**

1. Abrir la aplicación.
2. Observar el catálogo inicial.

**Resultado esperado:** aparecen los seis productos iniciales con su nombre, categoría, precio y stock.

**Prueba 2: Buscar un producto**

1. Escribir `ratón` en el campo de búsqueda.
2. Observar el catálogo.

**Resultado esperado:** aparece el Ratón USB y desaparecen los productos que no coinciden.

**Prueba 3: Filtros sin resultados**

1. Escribir un nombre que no exista, por ejemplo `producto inexistente`.
2. Observar el catálogo.

**Resultado esperado:** no aparecen tarjetas de productos y se muestra el mensaje de que no hay resultados.

**Prueba 3 bis: Búsqueda y categoría combinadas**

1. Escribir `silla` en el buscador.
2. Seleccionar la categoría "Hogar" y después "Informática".

**Resultado esperado:** con "Hogar" aparece solo la Silla; con "Informática" no aparece ningún producto y se muestra el mensaje de que no hay resultados.

### 6.2. Carrito

**Prueba 4: Carrito vacío**

1. Abrir la aplicación sin añadir productos.
2. Observar el apartado del carrito.

**Resultado esperado:** aparece el mensaje de carrito vacío y los importes están a cero.

**Prueba 5: Añadir un producto**

1. Buscar el Ratón USB.
2. Introducir una cantidad de `2`.
3. Pulsar el botón de añadir.

**Resultado esperado:** aparece una línea en el carrito con dos ratones y un subtotal de 25 €. El stock que aparece en el catálogo no cambia.

**Prueba 6: Sumar cantidades**

1. Añadir dos unidades del Ratón USB.
2. Volver a añadir una unidad del mismo producto.

**Resultado esperado:** aparece una única línea del producto con una cantidad total de tres unidades.

**Prueba 7: Producto agotado**

1. Buscar el Teclado.
2. Observar su tarjeta.

**Resultado esperado:** el producto aparece como agotado y el campo de cantidad y el botón de añadir están desactivados.

**Prueba 8: Stock insuficiente**

1. Añadir las ocho unidades disponibles del Ratón USB.
2. Intentar añadir una unidad más.

**Resultado esperado:** la aplicación muestra un error de stock insuficiente y no permite superar las ocho unidades.

**Prueba 8 bis: Cantidades inválidas**

1. Borrar el campo de cantidad de un producto y pulsar añadir.
2. Escribir `0`, `-1` y `2.5` y pulsar añadir en cada caso.

**Resultado esperado:** la aplicación muestra un error distinto para cada caso (cantidad vacía, cantidad no mayor que cero y cantidad no entera) y el carrito no cambia.

**Prueba 9: Eliminar líneas**

1. Añadir un Ratón USB y una Webcam.
2. Pulsar el botón de retirar del Ratón USB.

**Resultado esperado:** desaparece la línea del Ratón USB y el resumen del carrito se actualiza correctamente. Si se retira también la última línea, vuelve el mensaje de carrito vacío.

### 6.3. Cálculos y descuentos

**Prueba 10: Subtotal inferior a 100 €**

1. Añadir dos unidades del Ratón USB.

**Resultado esperado:**
- Subtotal: 25 €.
- Descuento: 0 €.
- Total: 25 €.

**Prueba 11: Umbral de 100 €**

1. Añadir ocho unidades del Ratón USB (subtotal exacto de 100 €).
2. Vaciar el carrito y añadir un Monitor (129,90 €).

**Resultado esperado:**
- Con ocho ratones: subtotal 100 €, descuento 10 € y total 90 €.
- Con el Monitor: subtotal 129,90 €, descuento 12,99 € y total 116,91 €.

**Prueba 11 bis: Justo por debajo del umbral**

1. Añadir una Silla y un Ratón USB.

**Resultado esperado:** subtotal 97,50 €, descuento 0 € y total 97,50 €.

### 6.4. Formulario y validaciones

**Prueba 12: Correo electrónico inválido**

1. Añadir un producto al carrito.
2. Introducir un nombre válido.
3. Escribir `correo-invalido` en el campo de correo.
4. Intentar confirmar el pedido.

**Resultado esperado:** aparece un error indicando que el correo electrónico no es válido y no se confirma el pedido.

**Prueba 13: Código postal inválido**

1. Añadir un producto al carrito.
2. Seleccionar la modalidad de envío.
3. Introducir una dirección válida.
4. Introducir `123` como código postal. Repetir con `00000`, `53000` y `abcde`.
5. Completar el resto de campos obligatorios e intentar confirmar.

**Resultado esperado:** aparece un error indicando que el código postal no es válido y el pedido no se confirma. Con `01000`, `41001` o `52999` no aparece error.

**Prueba 14: Cambio de modalidad**

1. Seleccionar la modalidad de envío.
2. Observar los campos de dirección y código postal.
3. Escribir un código postal inválido.
4. Cambiar a recogida.

**Resultado esperado:** los campos de dirección y código postal se ocultan, dejan de ser obligatorios, se limpian sus valores y no queda ningún error visible. El pedido se puede confirmar.

**Prueba 14 bis: Nombre y aceptación**

1. Escribir solo espacios en el nombre.
2. Dejar sin marcar la casilla de aceptación.
3. Intentar confirmar el pedido.

**Resultado esperado:** aparecen los errores del nombre y de la aceptación, y no se confirma el pedido. Los datos escritos en el formulario no se pierden.

**Prueba 14 ter: Contador de observaciones**

1. Escribir texto en las observaciones.

**Resultado esperado:** el contador muestra el número de caracteres sobre 200 y se actualiza mientras se escribe.

### 6.5. Confirmación de pedidos

**Prueba 15: Confirmar un pedido correctamente**

1. Añadir dos unidades del Ratón USB.
2. Introducir un nombre válido.
3. Introducir un correo electrónico válido.
4. Seleccionar recogida.
5. Aceptar las condiciones.
6. Confirmar el pedido.

**Resultado esperado:**
- Aparece el mensaje de éxito.
- Se crea un pedido en el historial.
- El carrito queda vacío.
- El stock del Ratón USB pasa de 8 a 6.
- El formulario se reinicia.
- El catálogo se actualiza.

**Prueba 16: Confirmar con el carrito vacío**

1. Abrir la aplicación sin añadir productos.
2. Completar los datos del formulario.
3. Intentar confirmar el pedido.

**Resultado esperado:** aparece un mensaje indicando que el carrito está vacío y no se crea ningún pedido.

**Prueba 16 bis: Stock insuficiente al confirmar**

1. Añadir tres Sillas al carrito.
2. Abrir la consola de DevTools y ejecutar `catalogo[5].stock = 1`.
3. Completar el formulario e intentar confirmar.

**Resultado esperado:** aparece un error que indica la Silla, con las unidades solicitadas y las disponibles. No se crea pedido, el stock y el carrito no cambian y el formulario conserva sus datos.

### 6.6. Historial y exportación

**Prueba 17: Consultar el historial**

1. Confirmar un pedido correctamente.
2. Ir al apartado del historial.

**Resultado esperado:** aparece el pedido creado con su número, fecha, cliente, modalidad e importe, y un detalle desplegable con sus productos.

**Prueba 18: Filtrar por modalidad**

1. Crear un pedido de recogida y otro de envío.
2. Seleccionar el filtro de recogida.

**Resultado esperado:** aparece únicamente el pedido de recogida, y el número de pedidos y el importe corresponden solo a ese pedido.

**Prueba 19: Filtro sin resultados**

1. Crear únicamente un pedido de recogida.
2. Seleccionar el filtro de envío.

**Resultado esperado:** no aparecen pedidos, el número de pedidos y el importe están a cero y se muestra el mensaje correspondiente a la ausencia de resultados, sin valores `NaN` ni `Infinity`.

**Prueba 20: Exportar historial**

1. Crear uno o varios pedidos.
2. Pulsar el botón de exportar historial.

**Resultado esperado:** aparece el contenido JSON con todos los pedidos realizados, independientemente del filtro seleccionado.

**Prueba 20 bis: Exportar sin pedidos**

1. Recargar la aplicación.
2. Pulsar el botón de exportar historial.

**Resultado esperado:** el textarea muestra `[]`.

**Prueba 21: Texto con HTML**

1. Confirmar un pedido con el nombre `<b>hola</b>`.

**Resultado esperado:** en el historial el nombre se muestra como texto, sin aplicar negrita.

---

## 7. Depuración con punto de interrupción

Se ha utilizado la herramienta de desarrolladores del navegador para depurar el funcionamiento de JavaScript.

**Procedimiento:**

1. Abrir la aplicación en el navegador.
2. Pulsar `F12` para abrir las herramientas de desarrolladores.
3. Acceder a la pestaña **Sources**.
4. Abrir el fichero `js/pedidos.js`.
5. Colocar un punto de interrupción en una línea de la función `crearPedido(datos)`.
6. Completar el formulario y confirmar un pedido.
7. Observar cómo la ejecución se detiene en el punto de interrupción.

**Qué se comprueba:**

- Los datos del formulario recibidos por la función.
- Los productos incluidos en el pedido.
- Las cantidades y los importes calculados.
- El contenido del objeto `pedido`.

[COMPLETAR: explicación con tus palabras de qué línea elegiste, qué valores viste y qué comprobaste.]

## 8. Comprobación de la carga mediante HTTP

Se ha comprobado la carga de los ficheros de la aplicación mediante la pestaña **Network** de las herramientas de desarrolladores.

**Procedimiento:**

1. Ejecutar la aplicación mediante un servidor HTTP local.
2. Abrir las herramientas de desarrolladores con `F12`.
3. Acceder a la pestaña **Network**.
4. Recargar la página.
5. Localizar las peticiones correspondientes a `index.html`, `estilos.css` y los diez ficheros de `js/`.
6. Comprobar que todas se han realizado correctamente y en el orden esperado.

**Qué se comprueba:**

- Que los ficheros JavaScript se solicitan mediante HTTP.
- Que el navegador recibe correctamente cada fichero.
- Que la respuesta tiene un estado HTTP satisfactorio, normalmente `200`.

---

## 9. Uso de la inteligencia artificial

**Enlaces a las conversaciones:**

- [COMPLETAR: enlace a la conversación con Claude, o referencia a la exportación incluida en el repositorio]

**Cómo la he utilizado:** [COMPLETAR con tus palabras: como consulta sobre cómo hacer, con el planteamiento y las decisiones propias.]

**Consultas relevantes y decisiones tomadas:**

| Consulta | Qué señaló o propuso la IA | Qué cambié en mi código | Por qué y cómo lo comprobé |
|---|---|---|---|
| Revisión de los métodos de `Producto` | `comprobarDisponibilidad` asignaba `this.stock = 8` en lugar de comparar y no recibía la cantidad | El método recibe la cantidad y compara con el stock; `descontarStock` reutiliza esa comprobación | [COMPLETAR] |
| Validación en el constructor | La IA planteó la decisión y los casos límite; la validación con `throw` la escribí yo | Validación de id, nombre, categoría, precio y stock | [COMPLETAR] |
| `calcularDescuento` | Devolvía `undefined` por debajo del umbral y el porcentaje era ambiguo (`10` frente a `0.1`) | Devuelve siempre un número, el porcentaje es una fracción y se valida | [COMPLETAR] |
| Redondeo y total | Señaló el error de coma flotante (`99.69999999999999`) y que el total arrastraba decimales | Redondeo en `calcularSubtotal` y función `calcularTotal` | [COMPLETAR] |
| Tarjetas del catálogo | `dataset` devuelve cadenas, el `max` de un producto agotado y las clases de CSS sin usar | Conversión con `Number`, valor de la cantidad para productos agotados y clases del CSS aplicadas | [COMPLETAR] |
| Carrito | Comprobación de la cantidad acumulada y delegación de eventos con `closest` | Manejadores en `#lista-productos` y `#lineas-carrito` | [COMPLETAR] |
| Formulario | Qué comprobar en la regex del código postal, la limpieza de errores personalizados y el efecto de `form.reset()` | `validarDatosPedido`, `actualizarErroresFormulario` y llamadas manuales tras el reinicio | [COMPLETAR] |
| Confirmación del pedido | Orden "comprobar y después modificar", comprobación de stock aparte y copia de líneas en el pedido | `comprobarStockCarrito`, `crearPedido` y evento `submit` | [COMPLETAR] |
| Identificador del pedido | Ventajas de un identificador corto frente a `Date.now()` y alternativa con contador | `crearID` | [COMPLETAR] |
| Organización del código | Dividir un único `app.js` en varios ficheros | Diez ficheros con scripts clásicos y `defer` en orden | [COMPLETAR] |

---

## 10. Conclusión

La práctica permite aplicar los conocimientos de JavaScript del lado del cliente mediante la creación de una aplicación interactiva de gestión de compras.

Se han trabajado clases, objetos, arrays, funciones, eventos, manipulación del DOM, validaciones de formularios, gestión de datos y exportación JSON.

También se ha utilizado el navegador para comprobar el funcionamiento de la aplicación y realizar tareas básicas de depuración.
