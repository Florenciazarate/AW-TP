const formulario = document.querySelector("#pago");
const bloques = formulario.querySelectorAll("[data-metodo]");

function mostrarMetodo() {
  const elegido = formulario.querySelector("input[name='metodo-pago']:checked").value;

  bloques.forEach((bloque) => {
    const activo = bloque.dataset.metodo === elegido;

    bloque.hidden = !activo;

    bloque.querySelectorAll("input").forEach((campo) => {
      campo.disabled = !activo;
    });
  });
}

formulario.addEventListener("change", (evento) => {
  if (evento.target.name === "metodo-pago") {
    mostrarMetodo();
  }
});

mostrarMetodo();
