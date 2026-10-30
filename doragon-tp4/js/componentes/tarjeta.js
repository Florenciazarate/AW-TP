import { formatoPrecio, normalizar } from "../utilidades/formato.js";

function crearAccion(producto) {
  if (producto.stock === 0) {
    return `<a class="boton tenue chico" href="nosotros.html#contacto">Avisame</a>`;
  }

  if (producto.tipo === "sobres") {
    return `<a class="boton primario chico" href="tirada.html">Abrir</a>`;
  }

  return `<a class="boton primario chico" href="carrito.html">Comprar</a>`;
}

export function crearTarjeta(producto, conDetalle) {
  const titulo = conDetalle
    ? `<button class="detalle-abrir" type="button" data-accion="detalle" data-id="${producto.id}">${producto.nombre}</button>`
    : producto.nombre;

  const aviso = producto.stock === 0
    ? `<p class="etiqueta agotado aviso">Sin stock</p>`
    : "";

  return `
    <li class="tarjeta-sobre ${producto.fondo}"
        data-id="${producto.id}"
        data-tipo="${producto.tipo}"
        data-coleccion="${producto.coleccion}"
        data-rareza="${producto.rareza}"
        data-precio="${producto.precio}"
        data-stock="${producto.stock}"
        data-nombre="${normalizar(producto.nombre)}">
      ${aviso}
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">
      <div class="cuerpo">
        <h3>${titulo}</h3>
        <p class="detalle">${producto.detalle}</p>
        <div class="compra">
          <p class="precio">${formatoPrecio(producto.precio)}</p>
          ${crearAccion(producto)}
        </div>
      </div>
    </li>`;
}
