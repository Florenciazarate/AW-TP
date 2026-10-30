export function sortearRareza(tabla) {
  const azar = Math.random() * 100;
  let acumulado = 0;

  for (const opcion of tabla) {
    acumulado += opcion.porcentaje;
    if (azar < acumulado) {
      return opcion.rareza;
    }
  }

  return tabla[tabla.length - 1].rareza;
}

export function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
