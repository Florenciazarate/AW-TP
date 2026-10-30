const contador = document.querySelector(".cabecera .contador");
const textoOculto = document.querySelector(".cabecera .icono.carrito .solo-lectores");

export function fijarContador(cantidad) {
  contador.textContent = cantidad;
  textoOculto.textContent = "Carrito, " + cantidad + " productos";
}

export function sumarAlContador(cantidad) {
  fijarContador(Number(contador.textContent) + cantidad);
}
