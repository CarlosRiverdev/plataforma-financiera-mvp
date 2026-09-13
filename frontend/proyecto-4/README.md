# Calculadora de interés simple y compuesto

Propuesta de front-end para el informe. Tres ventanas funcionales hechas con HTML, CSS y Chart.js.

## Cómo abrirlo en VS Code

1. Descargá la carpeta `calculadora-interes` y abrila en VS Code (`Archivo → Abrir carpeta`).
2. Instalá la extensión **Live Server** (Ritwick Dey).
3. Clic derecho sobre `index.html` → **Open with Live Server**.

También funciona abriendo `index.html` directamente en el navegador. Chart.js y las tipografías se cargan por CDN, así que hace falta internet la primera vez.

## Estructura

```
calculadora-interes/
├── index.html                     estructura de las 3 ventanas
├── css/estilos.css                diseño, tipografía y responsive
├── js/app.js                      validación, fórmulas y gráficas
└── assets/diagrama-interaccion.svg  diagrama para el informe
```

## Las tres ventanas

| Ventana | Qué hace |
|---|---|
| Interés simple | `A = P (1 + r·t)`, gráfica lineal y tabla de interés anual |
| Interés compuesto | `A = P (1 + r/n)^(n·t)`, elige capitalización y muestra la tasa efectiva |
| Comparación | Las dos curvas sobre los mismos datos, diferencia final y año de separación |

## Validación de entradas

`leerCampo()` en `js/app.js` revisa cada campo antes de calcular: campo vacío, texto que no es número, capital menor o igual a 0, tasa fuera de 0–100 % y tiempo entre 1 y 60 años enteros. El mensaje aparece debajo del campo y el borde se marca en rojo.

## Para extender

- `frecuencia` ya está parametrizada, así que agregar otra capitalización es una línea más en el `<select>`.
- Para la ventana de historial: guardar cada cálculo en un arreglo y pintarlo en una tabla; la función de formato `bs()` ya está lista.
- Los colores están en variables CSS al inicio de `estilos.css`.
