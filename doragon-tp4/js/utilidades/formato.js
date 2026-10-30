export function formatoPrecio(valor) {
  return "$" + valor.toLocaleString("es-AR");
}

export function numeroCarta(numero, total) {
  return String(numero).padStart(3, "0") + "/" + total;
}

export function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
