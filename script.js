// Selección de elementos
const canvas = document.getElementById('canvas');
const fondo = document.getElementById('fondo');
const piezas = document.querySelectorAll('#tray img');
const downloadBtn = document.getElementById('download-btn');

let dragged = null;
let offsetX = 0;
let offsetY = 0;

// ARRASTRAR PIEZAS DESDE LA BANDEJA
piezas.forEach(pieza => {
  pieza.addEventListener('dragstart', (e) => {
    // clonamos la pieza
    dragged = e.target.cloneNode(true);
    dragged.classList.add('pieza-canvas');

    // valores iniciales de escala
    dragged.dataset.scale = 1;

    // activar el arrastre dentro del canvas
    dragged.addEventListener('mousedown', pieceMouseDown);

    // permitir zoom con la rueda
    dragged.addEventListener('wheel', (e) => {
      e.preventDefault();
      let scale = parseFloat(dragged.dataset.scale) || 1;
      scale += e.deltaY * -0.001;
      scale = Math.min(Math.max(0.5, scale), 2);
      dragged.style.transform = `scale(${scale})`;
      dragged.dataset.scale = scale;
    });

    // insertamos en el canvas
    canvas.appendChild(dragged);

    // posición inicial
    const rect = canvas.getBoundingClientRect();
    dragged.style.left = `${e.clientX - rect.left - 40}px`;
    dragged.style.top = `${e.clientY - rect.top - 40}px`;
  });
});

// FUNCIONES DE ARRASTRE DENTRO DEL CANVAS
function pieceMouseDown(e) {
  dragged = e.target;
  offsetX = e.offsetX;
  offsetY = e.offsetY;

  document.addEventListener('mousemove', pieceMouseMove);
  document.addEventListener('mouseup', pieceMouseUp);
}

function pieceMouseMove(e) {
  if (!dragged) return;
  const rect = canvas.getBoundingClientRect();
  dragged.style.left = `${e.clientX - rect.left - offsetX}px`;
  dragged.style.top = `${e.clientY - rect.top - offsetY}px`;
}

function pieceMouseUp(e) {
  document.removeEventListener('mousemove', pieceMouseMove);
  document.removeEventListener('mouseup', pieceMouseUp);
  dragged = null;
}

// BOTÓN DE DESCARGA SIMULADO
downloadBtn.addEventListener('click', () => {
  alert("¡Descargalo con garra! 🎉");
});

