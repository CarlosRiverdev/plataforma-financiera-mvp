/* ============================================================
   Calculadora de interés simple y compuesto
   Lógica: navegación entre ventanas, validación, cálculo y gráficas
   ============================================================ */

/* ---------- Utilidades ---------- */

const moneda = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'BOB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const porcentaje = new Intl.NumberFormat('es-BO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const bs = (n) => moneda.format(n);
const pct = (n) => porcentaje.format(n) + ' %';
const $ = (id) => document.getElementById(id);

/* ---------- Fórmulas financieras ---------- */

// A = P (1 + r·t)
function interesSimple(capital, tasaAnual, anios) {
  return capital * (1 + (tasaAnual / 100) * anios);
}

// A = P (1 + r/n)^(n·t)
function interesCompuesto(capital, tasaAnual, anios, frecuencia) {
  const r = tasaAnual / 100;
  return capital * Math.pow(1 + r / frecuencia, frecuencia * anios);
}

// Serie año por año, desde el año 0 hasta el año t
function serieSimple(capital, tasa, anios) {
  const serie = [];
  for (let i = 0; i <= anios; i++) serie.push(interesSimple(capital, tasa, i));
  return serie;
}

function serieCompuesta(capital, tasa, anios, frecuencia) {
  const serie = [];
  for (let i = 0; i <= anios; i++) serie.push(interesCompuesto(capital, tasa, i, frecuencia));
  return serie;
}

/* ---------- Validación de entradas ---------- */

/**
 * Lee un campo numérico, lo valida y muestra el error debajo del input.
 * Devuelve el número válido o null si hay error.
 */
function leerCampo(idInput, idError, reglas) {
  const input = $(idInput);
  const salidaError = $(idError);
  const contenedor = input.closest('.campo');
  const bruto = input.value.trim();
  let mensaje = '';

  if (bruto === '') {
    mensaje = 'Escribí un valor.';
  } else {
    const valor = Number(bruto);
    if (Number.isNaN(valor)) {
      mensaje = 'Solo se aceptan números.';
    } else if (reglas.min !== undefined && valor < reglas.min) {
      mensaje = reglas.mensajeMin || `El mínimo es ${reglas.min}.`;
    } else if (reglas.max !== undefined && valor > reglas.max) {
      mensaje = reglas.mensajeMax || `El máximo es ${reglas.max}.`;
    } else if (reglas.entero && !Number.isInteger(valor)) {
      mensaje = 'Usá un número entero de años.';
    }
  }

  salidaError.textContent = mensaje;
  contenedor.classList.toggle('campo--invalido', mensaje !== '');
  input.setAttribute('aria-invalid', mensaje !== '');

  return mensaje === '' ? Number(bruto) : null;
}

const REGLA_CAPITAL = { min: 0.01, mensajeMin: 'El capital tiene que ser mayor a 0.' };
const REGLA_TASA = { min: 0, max: 100, mensajeMax: 'Usá una tasa de 0 a 100 %.' };
const REGLA_TIEMPO = { min: 1, max: 60, entero: true, mensajeMax: 'El máximo son 60 años.' };

/* ---------- Configuración base de las gráficas ---------- */

const TINTA = '#14202a';
const GRIS = '#5a6872';
const COLOR_SIMPLE = '#2c5d8f';
const COLOR_COMPUESTO = '#17714a';

Chart.defaults.font.family = "'IBM Plex Sans', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = GRIS;

function opcionesGrafica(mostrarLeyenda) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: mostrarLeyenda,
        position: 'top',
        align: 'start',
        labels: { boxWidth: 14, boxHeight: 3, usePointStyle: false }
      },
      tooltip: {
        backgroundColor: TINTA,
        padding: 12,
        cornerRadius: 4,
        titleFont: { weight: '600' },
        callbacks: {
          title: (items) => 'Año ' + items[0].label,
          label: (item) => ' ' + item.dataset.label + ': ' + bs(item.parsed.y)
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Años', color: GRIS },
        grid: { color: 'rgba(20,32,42,.06)' },
        border: { color: '#d3d7cc' }
      },
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(20,32,42,.06)' },
        border: { color: '#d3d7cc' },
        ticks: {
          callback: (valor) => 'Bs ' + new Intl.NumberFormat('es-BO', {
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(valor)
        }
      }
    }
  };
}

function datasetLinea(etiqueta, datos, color, punteada) {
  return {
    label: etiqueta,
    data: datos,
    borderColor: color,
    backgroundColor: color + '1a',
    borderWidth: 2,
    borderDash: punteada ? [6, 4] : [],
    tension: 0,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointBackgroundColor: color,
    fill: true
  };
}

// Guardamos las instancias para poder destruirlas y volver a dibujar
const graficas = { simple: null, compuesto: null, comparativa: null };

function dibujar(clave, idCanvas, etiquetas, datasets, mostrarLeyenda) {
  if (graficas[clave]) graficas[clave].destroy();
  graficas[clave] = new Chart($(idCanvas), {
    type: 'line',
    data: { labels: etiquetas, datasets: datasets },
    options: opcionesGrafica(mostrarLeyenda)
  });
}

const etiquetasAnios = (anios) => Array.from({ length: anios + 1 }, (_, i) => String(i));

/* ============================================================
   VENTANA 1 — Interés simple
   ============================================================ */

function calcularVentanaSimple(evento) {
  if (evento) evento.preventDefault();

  const capital = leerCampo('s-capital', 'err-s-capital', REGLA_CAPITAL);
  const tasa = leerCampo('s-tasa', 'err-s-tasa', REGLA_TASA);
  const anios = leerCampo('s-tiempo', 'err-s-tiempo', REGLA_TIEMPO);
  if (capital === null || tasa === null || anios === null) return;

  const final = interesSimple(capital, tasa, anios);
  const interes = final - capital;

  $('s-inicial').textContent = bs(capital);
  $('s-interes').textContent = bs(interes);
  $('s-final').textContent = bs(final);
  $('s-porcentaje').textContent = pct(capital > 0 ? (interes / capital) * 100 : 0);

  const serie = serieSimple(capital, tasa, anios);
  dibujar('simple', 'grafica-simple', etiquetasAnios(anios),
    [datasetLinea('Interés simple', serie, COLOR_SIMPLE, false)], false);

  // Detalle anual: con interés simple el interés del año es siempre el mismo
  const interesAnual = capital * (tasa / 100);
  let filas = '';
  for (let i = 1; i <= anios; i++) {
    filas += `<tr>
      <td>${i}</td>
      <td>${bs(interesAnual)}</td>
      <td>${bs(interesAnual * i)}</td>
      <td>${bs(serie[i])}</td>
    </tr>`;
  }
  $('tabla-simple').innerHTML = filas;
}

/* ============================================================
   VENTANA 2 — Interés compuesto
   ============================================================ */

function calcularVentanaCompuesta(evento) {
  if (evento) evento.preventDefault();

  const capital = leerCampo('c-capital', 'err-c-capital', REGLA_CAPITAL);
  const tasa = leerCampo('c-tasa', 'err-c-tasa', REGLA_TASA);
  const anios = leerCampo('c-tiempo', 'err-c-tiempo', REGLA_TIEMPO);
  const frecuencia = Number($('c-frecuencia').value);
  if (capital === null || tasa === null || anios === null) return;

  const final = interesCompuesto(capital, tasa, anios, frecuencia);
  const interes = final - capital;
  const efectiva = (Math.pow(1 + (tasa / 100) / frecuencia, frecuencia) - 1) * 100;

  $('c-inicial').textContent = bs(capital);
  $('c-interes').textContent = bs(interes);
  $('c-final').textContent = bs(final);
  $('c-efectiva').textContent = pct(efectiva);

  const serie = serieCompuesta(capital, tasa, anios, frecuencia);
  dibujar('compuesto', 'grafica-compuesto', etiquetasAnios(anios),
    [datasetLinea('Interés compuesto', serie, COLOR_COMPUESTO, false)], false);

  let filas = '';
  for (let i = 1; i <= anios; i++) {
    filas += `<tr>
      <td>${i}</td>
      <td>${bs(serie[i - 1])}</td>
      <td>${bs(serie[i] - serie[i - 1])}</td>
      <td>${bs(serie[i])}</td>
    </tr>`;
  }
  $('tabla-compuesto').innerHTML = filas;
}

/* ============================================================
   VENTANA 3 — Comparación
   ============================================================ */

function calcularVentanaGrafica(evento) {
  if (evento) evento.preventDefault();

  const capital = leerCampo('g-capital', 'err-g-capital', REGLA_CAPITAL);
  const tasa = leerCampo('g-tasa', 'err-g-tasa', REGLA_TASA);
  const anios = leerCampo('g-tiempo', 'err-g-tiempo', REGLA_TIEMPO);
  const frecuencia = Number($('g-frecuencia').value);
  if (capital === null || tasa === null || anios === null) return;

  const sSerie = serieSimple(capital, tasa, anios);
  const cSerie = serieCompuesta(capital, tasa, anios, frecuencia);

  dibujar('comparativa', 'grafica-comparativa', etiquetasAnios(anios), [
    datasetLinea('Interés simple', sSerie, COLOR_SIMPLE, false),
    datasetLinea('Interés compuesto', cSerie, COLOR_COMPUESTO, true)
  ], false);

  const finalSimple = sSerie[anios];
  const finalCompuesto = cSerie[anios];

  $('g-final-simple').textContent = bs(finalSimple);
  $('g-final-compuesto').textContent = bs(finalCompuesto);
  $('g-diferencia').textContent = bs(finalCompuesto - finalSimple);

  // Primer año en que el compuesto supera al simple en más de 1 %
  let cruce = '—';
  for (let i = 1; i <= anios; i++) {
    if (cSerie[i] > sSerie[i] * 1.01) { cruce = 'Año ' + i; break; }
  }
  $('g-cruce').textContent = cruce;
}

/* ============================================================
   Navegación entre ventanas
   ============================================================ */

const calculos = {
  simple: calcularVentanaSimple,
  compuesto: calcularVentanaCompuesta,
  grafica: calcularVentanaGrafica
};

function abrirVentana(nombre) {
  document.querySelectorAll('.ventana').forEach((seccion) => {
    const activa = seccion.id === 'ventana-' + nombre;
    seccion.classList.toggle('ventana--visible', activa);
    seccion.hidden = !activa;
  });

  document.querySelectorAll('.pestana').forEach((boton) => {
    const activa = boton.dataset.ventana === nombre;
    boton.classList.toggle('pestana--activa', activa);
    if (activa) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  });

  // Chart.js necesita recalcular el tamaño al mostrar un canvas oculto
  if (graficas[nombre === 'grafica' ? 'comparativa' : nombre]) {
    graficas[nombre === 'grafica' ? 'comparativa' : nombre].resize();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ============================================================
   Arranque
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  $('form-simple').addEventListener('submit', calcularVentanaSimple);
  $('form-compuesto').addEventListener('submit', calcularVentanaCompuesta);
  $('form-grafica').addEventListener('submit', calcularVentanaGrafica);

  // Al restablecer, los valores por defecto del HTML vuelven y recalculamos
  ['form-simple', 'form-compuesto'].forEach((id) => {
    $(id).addEventListener('reset', () => {
      setTimeout(() => {
        document.querySelectorAll('.campo--invalido').forEach((c) => c.classList.remove('campo--invalido'));
        document.querySelectorAll('.campo__error').forEach((e) => (e.textContent = ''));
        calculos[id === 'form-simple' ? 'simple' : 'compuesto']();
      }, 0);
    });
  });

  document.querySelectorAll('.pestana').forEach((boton) => {
    boton.addEventListener('click', () => abrirVentana(boton.dataset.ventana));
  });

  // Limpiar el error mientras la persona corrige el campo
  document.querySelectorAll('.campo__caja input').forEach((input) => {
    input.addEventListener('input', () => {
      const contenedor = input.closest('.campo');
      if (contenedor.classList.contains('campo--invalido')) {
        contenedor.classList.remove('campo--invalido');
        contenedor.querySelector('.campo__error').textContent = '';
      }
    });
  });

  // Primer cálculo con los valores de ejemplo
  calcularVentanaSimple();
  calcularVentanaCompuesta();
  calcularVentanaGrafica();
});
