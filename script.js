// Selección de elementos
const canvas = document.getElementById('canvas');
const fondo = document.getElementById('fondo');
const piezas = document.querySelectorAll('#tray img');
const downloadBtn = document.getElementById('download-btn');

let dragged = null;
let offsetX = 0;
let offsetY = 0;

// ARRASTRAR PIEZAS
piezas.forEach(pieza => {
  pieza.addEventListener('dragstart', dragStart);

  // ESCALAR CON LA RUEDA
  pieza.addEventListener('wheel', (e) => {
    e.preventDefault();
    let scale = parseFloat(pieza.dataset.scale) || 1;
    scale += e.deltaY * -0.001;          // rueda arriba → agranda, abajo → achica
    scale = Math.min(Math.max(0.5, scale), 2); // límite 0.5x a 2x
    pieza.style.transform = `scale(${scale})`;
    pieza.dataset.scale = scale;
  });
});

// FUNCIONES DE ARRASTRE
function dragStart(e) {
  dragged = e.target.cloneNode(true);  // clonamos la pieza
  dragged.classList.add('pieza-canvas');
  canvas.appendChild(dragged);

  const rect = dragged.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  dragged.style.lef
