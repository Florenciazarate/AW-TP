import { productos } from "../datos/productos.js";
import { crearTarjeta } from "../componentes/tarjeta.js";

const destacados = document.querySelector("#destacados");

destacados.innerHTML = productos
  .filter((producto) => producto.destacado)
  .map((producto) => crearTarjeta(producto, false))
  .join("");
