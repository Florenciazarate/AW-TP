import { productos } from "../datos/productos.js";
import { tipos, colecciones, rarezas } from "../datos/categorias.js";
import { crearTarjeta } from "../componentes/tarjeta.js";
import { normalizar } from "../utilidades/formato.js";
import { abrirDetalle } from "./detalle.js";

const porPagina = 6;
const precioMaximo = Math.max(...productos.map((producto) => producto.precio));
let limite = porPagina;

const formulario = document.querySelector("#filtros");
const lista = document.querySelector("#lista-productos");
const aplicados = document.querySelector("#aplicados");
const total = document.querySelector("#total");
const vacio = document.querySelector("#vacio");
const botonMas = document.querySelector("#cargar-mas");
const buscador = document.querySelector(".cabecera .buscador input");
const formularioBuscador = document.querySelector(".cabecera .buscador");

function crearFiltros() {
  formulario.innerHTML = `
    <fieldset class="grupo">
      <legend>Tipo de producto</legend>
      <div class="pildoras">
        ${tipos.map((tipo, indice) => `
          <label class="pildora">
            <input class="solo-lectores" type="radio" name="tipo" value="${tipo.id}" ${indice === 0 ? "checked" : ""}>
            ${tipo.nombre}
          </label>`).join("")}
      </div>
    </fieldset>

    <fieldset class="grupo">
      <legend>Colección</legend>
      ${colecciones.map((coleccion) => `
        <label class="casilla">
          <input type="checkbox" name="coleccion" value="${coleccion.id}">
          ${coleccion.nombre} (<span data-contador="${coleccion.id}">0</span>)
        </label>`).join("")}
    </fieldset>

    <fieldset class="grupo">
      <legend>Rareza</legend>
      <div class="pildoras">
        ${rarezas.map((rareza) => `
          <label class="pildora">
            <input class="solo-lectores" type="checkbox" name="rareza" value="${rareza}">
            ${rareza}★
          </label>`).join("")}
      </div>
    </fieldset>

    <fieldset class="grupo">
      <legend>Precio</legend>
      <div class="rejilla">
        <div class="campo">
          <label for="precio-min">Mínimo</label>
          <input type="number" id="precio-min" name="precio_min" min="0" max="${precioMaximo}" step="100" value="0">
        </div>
        <div class="campo">
          <label for="precio-max">Máximo</label>
          <input type="number" id="precio-max" name="precio_max" min="0" max="${precioMaximo}" step="100" value="${precioMaximo}">
        </div>
      </div>
    </fieldset>

    <fieldset class="grupo">
      <legend>Disponibilidad</legend>
      <label class="casilla">
        <input type="checkbox" name="stock" value="1">
        Solo con stock
      </label>
    </fieldset>

    <div class="campo">
      <label for="orden">Ordenar por</label>
      <select id="orden" name="orden">
        <option value="nuevos">Más nuevos</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>
    </div>

    <div class="acciones">
      <button class="boton secundario chico" type="button" id="limpiar">Limpiar</button>
    </div>`;
}

function crearListado() {
  lista.innerHTML = productos.map((producto) => crearTarjeta(producto, true)).join("");

  [...lista.children].forEach((tarjeta, indice) => {
    tarjeta.dataset.orden = indice;
  });
}

function leerFiltros() {
  const datos = new FormData(formulario);
  const maximo = datos.get("precio_max");

  return {
    tipo: datos.get("tipo"),
    colecciones: datos.getAll("coleccion"),
    rarezas: datos.getAll("rareza"),
    minimo: Number(datos.get("precio_min")) || 0,
    maximo: maximo === "" ? precioMaximo : Number(maximo),
    soloStock: datos.get("stock") === "1",
    orden: datos.get("orden"),
    texto: normalizar(buscador.value.trim())
  };
}

function coincide(tarjeta, filtros) {
  const datos = tarjeta.dataset;
  const precio = Number(datos.precio);

  if (datos.tipo !== filtros.tipo) {
    return false;
  }

  if (filtros.colecciones.length > 0 && !filtros.colecciones.includes(datos.coleccion)) {
    return false;
  }

  if (filtros.rarezas.length > 0 && !filtros.rarezas.includes(datos.rareza)) {
    return false;
  }

  if (precio < filtros.minimo || precio > filtros.maximo) {
    return false;
  }

  if (filtros.soloStock && Number(datos.stock) === 0) {
    return false;
  }

  return datos.nombre.includes(filtros.texto);
}

function ordenar(tarjetas, orden) {
  const copia = [...tarjetas];

  if (orden === "precio-asc") {
    copia.sort((a, b) => Number(a.dataset.precio) - Number(b.dataset.precio));
  } else if (orden === "precio-desc") {
    copia.sort((a, b) => Number(b.dataset.precio) - Number(a.dataset.precio));
  } else {
    copia.sort((a, b) => Number(a.dataset.orden) - Number(b.dataset.orden));
  }

  return copia;
}

function actualizarContadores(tipo) {
  colecciones.forEach((coleccion) => {
    const cantidad = lista.querySelectorAll(`[data-tipo="${tipo}"][data-coleccion="${coleccion.id}"]`).length;
    formulario.querySelector(`[data-contador="${coleccion.id}"]`).textContent = cantidad;
  });
}

function mostrarAplicados(filtros) {
  const chips = [];

  filtros.colecciones.forEach((id) => {
    const coleccion = colecciones.find((item) => item.id === id);
    chips.push({ quitar: "coleccion", valor: id, texto: "Colección: " + coleccion.nombre });
  });

  filtros.rarezas.forEach((rareza) => {
    chips.push({ quitar: "rareza", valor: rareza, texto: "Rareza: " + rareza + "★" });
  });

  if (filtros.minimo > 0 || filtros.maximo < precioMaximo) {
    chips.push({ quitar: "precio", valor: "", texto: `Precio: $${filtros.minimo} – $${filtros.maximo}` });
  }

  if (filtros.soloStock) {
    chips.push({ quitar: "stock", valor: "", texto: "Solo con stock" });
  }

  if (filtros.texto !== "") {
    chips.push({ quitar: "texto", valor: "", texto: "Búsqueda: " + buscador.value.trim() });
  }

  aplicados.innerHTML = chips.map((chip) => `
    <li class="etiqueta">
      ${chip.texto}
      <button type="button" data-quitar="${chip.quitar}" data-valor="${chip.valor}" aria-label="Quitar filtro ${chip.texto}">×</button>
    </li>`).join("");
}

function aplicarFiltros() {
  const filtros = leerFiltros();
  const tarjetas = [...lista.children];
  const coincidentes = ordenar(tarjetas.filter((tarjeta) => coincide(tarjeta, filtros)), filtros.orden);

  tarjetas.forEach((tarjeta) => {
    tarjeta.hidden = true;
  });

  coincidentes.forEach((tarjeta, indice) => {
    lista.append(tarjeta);
    tarjeta.hidden = indice >= limite;
  });

  total.textContent = coincidentes.length;
  vacio.hidden = coincidentes.length > 0;
  botonMas.hidden = coincidentes.length <= limite;

  actualizarContadores(filtros.tipo);
  mostrarAplicados(filtros);
}

function reiniciarYAplicar() {
  limite = porPagina;
  aplicarFiltros();
}

function limpiarFiltros() {
  formulario.reset();
  buscador.value = "";
  reiniciarYAplicar();
}

function quitarFiltro(boton) {
  const { quitar, valor } = boton.dataset;

  if (quitar === "coleccion" || quitar === "rareza") {
    formulario.querySelector(`input[name="${quitar}"][value="${valor}"]`).checked = false;
  } else if (quitar === "precio") {
    formulario.precio_min.value = 0;
    formulario.precio_max.value = precioMaximo;
  } else if (quitar === "stock") {
    formulario.stock.checked = false;
  } else if (quitar === "texto") {
    buscador.value = "";
  }

  reiniciarYAplicar();
}

formulario.addEventListener("input", reiniciarYAplicar);

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
});

formulario.addEventListener("click", (evento) => {
  if (evento.target.id === "limpiar") {
    limpiarFiltros();
  }
});

buscador.addEventListener("input", reiniciarYAplicar);

formularioBuscador.addEventListener("submit", (evento) => {
  evento.preventDefault();
});

aplicados.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");

  if (boton) {
    quitarFiltro(boton);
  }
});

botonMas.addEventListener("click", () => {
  limite += porPagina;
  aplicarFiltros();
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion='detalle']");

  if (boton) {
    abrirDetalle(boton.dataset.id);
  }
});

crearFiltros();
crearListado();
aplicarFiltros();
