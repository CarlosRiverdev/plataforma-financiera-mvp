// intFijo.js
// Script para llenar la ventana de "Interés Fijo" con los
// datos que entregue la API del equipo de backend.


// --- Formatea números a formato de moneda (RD$) ---
function formatearMoneda(valor) {
    return "RD$ " + Number(valor).toLocaleString("es-DO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// CONFIGURACIÓN BASE DEL GRÁFICO (Chart.js)
// El gráfico nace vacío; se llena cuando llegan los datos
// de la API (ver renderizarInteresFijo más abajo).

const contexto = document.getElementById('graficoInteresFijo').getContext('2d');

const graficoInteresFijo = new Chart(contexto, {
    type: 'line',
    data: {
        // Se llenan dinámicamente con los datos de la API
        labels: [],
        datasets: [{
            label: 'Capital Total',
            data: [],
            borderColor: '#0056b3', // Color azul de la línea, similar al diseño
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0, // Oculta los puntos individuales en la línea
            tension: 0 // Línea recta (cambiar a > 0 si prefieren curva)
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 15,
                    color: '#333'
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Años',
                    color: '#333',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: '#e5e5e5'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'RD$',
                    color: '#333',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: '#e5e5e5'
                },
                ticks: {
                    // Simula el formateo "k" (ej: 200k) si el backend manda el número plano
                    callback: function(valor) {
                        if (valor >= 1000) {
                            return (valor / 1000) + 'k';
                        }
                        return valor;
                    }
                }
            }
        }
    }
});

// FUNCIÓN PRINCIPAL: llena todo (gráfico + tarjetas) con los
// datos que entregue la API del equipo de backend.
//
// Estructura esperada de "datos" (ajustar según lo que
// confirme el equipo de backend):
// {
//   montoInicial: 100000,
//   tasaInteres: 8,          // en porcentaje, ej. 8 = 8%
//   interesTotal: 80000,
//   capitalFinal: 180000,
//   periodos: [0, 1, 2, 3, ...],          // años, para el eje X
//   valoresPorPeriodo: [100000, 108000, ...] // capital acumulado, para el eje Y
// }
function renderizarInteresFijo(datos) {
    // --- Actualizar gráfico ---
    graficoInteresFijo.data.labels = datos.periodos;
    graficoInteresFijo.data.datasets[0].data = datos.valoresPorPeriodo;
    graficoInteresFijo.update();

    // --- Actualizar tarjetas de resumen ---
    document.getElementById('montoInicial').innerText = formatearMoneda(datos.montoInicial);
    document.getElementById('interesTotal').innerText = formatearMoneda(datos.interesTotal);
    document.getElementById('capitalFinal').innerText = formatearMoneda(datos.capitalFinal);

    // --- Actualizar etiqueta de tasa de interés ---
    document.getElementById('etiquetaTasaInteres').innerText = `${datos.tasaInteres}%`;
}


// EJEMPLO DE CÓMO CONECTAR CON LA API DEL BACKEND
// (el equipo de backend debe confirmar la URL y el formato real)

//
// fetch("https://api-del-equipo.com/interes-fijo", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ monto: 100000, tasa: 8, plazo: 3 })
// })
// .then(response => response.json())
// .then(datos => renderizarInteresFijo(datos))
// .catch(error => console.error("Error al obtener datos de la API:", error));