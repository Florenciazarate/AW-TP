const formularios = document.querySelectorAll("form[data-mensaje]");
const contadores = document.querySelectorAll("[data-contador-de]");
const actualizadores = [];

formularios.forEach((formulario) => {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let mensaje = formulario.querySelector(".mensaje");

    if (!mensaje) {
      mensaje = document.createElement("p");
      mensaje.className = "mensaje";
      mensaje.setAttribute("role", "status");
      formulario.append(mensaje);
    }

    mensaje.textContent = formulario.dataset.mensaje;
    formulario.reset();
    actualizadores.forEach((actualizar) => actualizar());
  });
});

contadores.forEach((contador) => {
  const campo = document.querySelector("#" + contador.dataset.contadorDe);

  function actualizar() {
    contador.textContent = campo.value.length + " / " + campo.maxLength;
  }

  campo.addEventListener("input", actualizar);
  actualizadores.push(actualizar);
  actualizar();
});
