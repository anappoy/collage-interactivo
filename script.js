const tray = document.getElementById('tray');
const canvas = document.getElementById('canvas');

// Para cada pieza en la bandeja
tray.querySelectorAll('.pieza').forEach(pieza => {
  pieza.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.src);
  });
});

// Permitir drop en el canvas
canvas.addEventListener('dragover', e => e.preventDefault());

canvas.addEventListener('drop', e => {
  e.preventDefault();
  const src = e.dataTransfer.getData('text/plain');
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('pieza-canvas');
  img.style.left = (e.offsetX - 50) + 'px';
  img.style.top = (e.offsetY - 50) + 'px';
  img.style.transform = 'rotate(0deg) scale(1)';

  // Variables para mover
  let shiftX, shiftY;
  let isDragging = false;

  // Arrastrar
  img.onmousedown = function(event) {
    isDragging = true;
    shiftX = event.clientX - img.getBoundingClientRect().left;
    shiftY = event.clientY - img.getBoundingClientRect().top;

    function moveAt(e) {
      if (isDragging) {
        img.style.left = e.clientX - shiftX - canvas.getBoundingClientRect().left + 'px';
        img.style.top = e.clientY - shiftY - canvas.getBoundingClientRect().top + 'px';
      }
    }

    document.addEventListener('mousemove', moveAt);

    img.onmouseup = function() {
      isDragging = false;
      document.removeEventListener('mousemove', moveAt);
      img.onmouseup = null;
    };
  };

  img.ondragstart = () => false; // desactiva drag nativo

  // Rotación con rueda del mouse
  img.addEventListener('wheel', e => {
    e.preventDefault();
    let current = img.style.transform.match(/rotate\((-?\d+)deg\)/);
    let angle = current ? parseInt(current[1]) : 0;
    angle += e.deltaY > 0 ? 15 : -15;
    let scale = img.style.transform.match(/scale\(([\d.]+)\)/);
    scale = scale ? scale[1] : 1;
    img.style.transform = `rotate(${angle}deg) scale(${scale})`;
  });

  // Escala con Shift + rueda del mouse
  img.addEventListener('wheel', e => {
    if (e.shiftKey) {
      e.preventDefault();
      let current = img.style.transform.match(/scale\(([\d.]+)\)/);
      let scale = current ? parseFloat(current[1]) : 1;
      scale += e.deltaY > 0 ? -0.1 : 0.1;
      if (scale < 0.1) scale = 0.1;
      let rotate = img.style.transform.match(/rotate\((-?\d+)deg\)/);
      rotate = rotate ? rotate[1] : 0;
      img.style.transform = `rotate(${rotate}deg) scale(${scale})`;
    }
  });

  canvas.appendChild(img);
});

