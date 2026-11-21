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
