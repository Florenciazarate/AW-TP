import { productos } from "../datos/productos.js";
import { carritoInicial, descuentoDrop, codigosDescuento } from "../datos/carritoInicial.js";
import { formatoPrecio } from "../utilidades/formato.js";
import { fijarContador } from "../utilidades/contador.js";

const items = carritoInicial.map((item) => ({ ...item }));
let porcentajeCodigo = 0;
let codigoAplicado = "";

const lista = document.querySelector("#lista-carrito");
const titulo = document.querySelector("#cantidad-items");
const vacio = document.querySelector("#carrito-vacio");
const totales = document.querySelector("#totales");
const irAlPago = document.querySelector("#ir-pago");
const formularioDescuento = document.querySelector("#form-descuento");
const campoCodigo = document.querySelector("#codigo");
const mensajeDescuento = document.querySelector("#mensaje-descuento");

function buscarProducto(id) {
  return productos.find((producto) => producto.id === id);
}

function crearItem(item) {
  const producto = buscarProducto(item.id);

  return `
    <li class="item" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">
      <div>
        <h3>${producto.nombre}</h3>
        <p class="detalle">${producto.detalle}</p>
      </div>
      <div class="campo">
        <label class="solo-lectores" for="cantidad-${producto.id}">Cantidad de ${producto.nombre}</label>
        <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="${item.cantidad}">
      </div>
      <div class="importe">
        <p class="precio">${formatoPrecio(producto.precio * item.cantidad)}</p>
        <button class="boton secundario chico" type="button" data-accion="quitar" data-id="${producto.id}">Quitar</button>
      </div>
    </li>`;
}

function calcularTotales() {
  let subtotal = 0;

  for (const item of items) {
    subtotal += buscarProducto(item.id).precio * item.cantidad;
  }

  const drop = subtotal > 0 ? descuentoDrop : 0;
  const codigo = Math.round(subtotal * porcentajeCodigo);

  return { subtotal, drop, codigo, total: subtotal - drop - codigo };
}

function mostrarTotales() {
  const resumen = calcularTotales();
  let unidades = 0;

  for (const item of items) {
    unidades += item.cantidad;
  }

  const lineaDrop = resumen.drop > 0
    ? `<div><dt>Descuento drop</dt><dd>−${formatoPrecio(resumen.drop)}</dd></div>`
    : "";

  const lineaCodigo = codigoAplicado !== "" && resumen.codigo > 0
    ? `<div><dt>Código ${codigoAplicado}</dt><dd>−${formatoPrecio(resumen.codigo)}</dd></div>`
    : "";

  totales.innerHTML = `
    <div><dt>Subtotal</dt><dd>${formatoPrecio(resumen.subtotal)}</dd></div>
    <div><dt>Envío</dt><dd>Gratis</dd></div>
    ${lineaDrop}
    ${lineaCodigo}
    <div class="total"><dt>Total</dt><dd>${formatoPrecio(resumen.total)}</dd></div>`;

  titulo.textContent = unidades;
  vacio.hidden = items.length > 0;
  irAlPago.hidden = items.length === 0;
  fijarContador(unidades);
}

function cambiarCantidad(id, valor) {
  const item = items.find((registro) => registro.id === id);
  const producto = buscarProducto(id);

  item.cantidad = Math.min(Math.max(valor || 1, 1), producto.stock);

  const fila = lista.querySelector(`[data-id="${id}"]`);
  fila.querySelector("input").value = item.cantidad;
  fila.querySelector(".precio").textContent = formatoPrecio(producto.precio * item.cantidad);

  mostrarTotales();
}

function quitarItem(id) {
  const posicion = items.findIndex((registro) => registro.id === id);
  items.splice(posicion, 1);
  lista.querySelector(`[data-id="${id}"]`).remove();
  mostrarTotales();
}

function aplicarCodigo(evento) {
  evento.preventDefault();

  const codigo = campoCodigo.value.trim().toUpperCase();

  if (codigosDescuento[codigo]) {
    porcentajeCodigo = codigosDescuento[codigo];
    codigoAplicado = codigo;
    mensajeDescuento.textContent = `Código aplicado: ${porcentajeCodigo * 100}% de descuento.`;
  } else {
    porcentajeCodigo = 0;
    codigoAplicado = "";
    mensajeDescuento.textContent = "El código no es válido.";
  }

  mostrarTotales();
}

lista.addEventListener("change", (evento) => {
  const fila = evento.target.closest("[data-id]");

  if (fila && evento.target.type === "number") {
    cambiarCantidad(fila.dataset.id, Number(evento.target.value));
  }
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion='quitar']");

  if (boton) {
    quitarItem(boton.dataset.id);
  }
});

formularioDescuento.addEventListener("submit", aplicarCodigo);

lista.innerHTML = items.map(crearItem).join("");
mostrarTotales();
