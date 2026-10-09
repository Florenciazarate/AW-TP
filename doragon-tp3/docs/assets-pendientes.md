# Assets pendientes — Doragon

Estado actual de los recursos de `assets/`. Para reemplazar cualquier archivo, mantener **mismo path y mismo nombre**: así no hay que tocar el HTML ni el CSS.

## Ya integrados (arte final del diseño)

| Path | Qué es |
|---|---|
| `assets/icons/cuenta.svg`, `carrito.svg`, `buscar.svg`, `flecha-derecha.svg`, `check.svg` | Íconos del header, buscador, newsletter y confirmación |
| `assets/img/cartas/vegeta.svg`, `piccolo.svg`, `gohan.svg`, `krilin.svg` | Cartas (tarjeta por rareza y color: 4★ naranja, 3★ verde, 3★ dorada, 2★ azul) |
| `assets/img/esferas/` | Las 7 esferas del dragón (4 encendidas, 3 apagadas) |
| `assets/img/escenas/` | Fondos: `hero-home`, `fondo-reveal`, `tirada-namek`, `tirada-saiyan`, `tirada-cell`, `shenlong-banner` |
| `assets/img/efectos/rayos-naranjas-520.svg` | Rayos decorativos del hero |

## Provisorios (a reemplazar)

| Path | Estado | Qué falta |
|---|---|---|
| `assets/img/logo/doragon-logo.svg` | Marca armada con los valores del mockup (cuadrado naranja `#F4791F`, radio 14, "D") | Logo final si existe como archivo |
| `assets/img/sobres/*.svg` (6 sobres) | Slot "SOBRE 3D" punteado | Arte del sobre cerrado. La apertura se reemplaza por un modelo 3D con Three.js en una etapa posterior |
| `assets/img/cartas/son-goku-kaioken.svg` | Slot oscuro "CARTA 3D" | Carta 5★ de Son Goku (no hay una carta 5★ en el export) |

Sobres usados: `saiyan-elite`, `namek`, `torneo-cell`, `fuerzas-especiales`, `legendario-shenron`, `torneo-mundial`.

## Notas

- Licencia oficial Dragon Ball: el arte final tiene que respetar el uso autorizado de la marca.
- Las cartas del export son por rareza y color, no por personaje.
- Los SVG del export traen metadata c2pa (marca de origen de la herramienta de diseño); se copiaron sin modificar.
