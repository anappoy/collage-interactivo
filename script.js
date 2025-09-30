const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");

// ===== Drag & Drop dentro del canvas =====
pieces.forEach(piece => {
  piece.addEventListener("mousedown", startDrag);
  piece.addEventListener("touchstart", startDragTouch, {passive:false});
});

function startDrag(e) {
  e.preventDefault();
  const piece = e.target.cloneNode(true);
  piece.classList.add("cloned");
  piece.style.position = "absolute";
  piece.style.width = "80px";
  piece.style.height = "80px";
  piece.style.left = e.clientX - canvas.getBoundingClientRect().left - 40 + "px";
  piece.style.top  = e.clientY - canvas.getBoundingClientRect().top - 40 + "px";
  piece.setAttribute("data-scale", 1);
  piece.setAttribute("data-rotation", 0);
  piece.style.zIndex = 10;
  canvas.appendChild(piece);

  dragElement(piece, e);
}

function startDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const piece = e.target.cloneNode(true);
  piece.classList.add("cloned");
  piece.style.position = "absolute";
  piece.style.width = "80px";
  piece.style.height = "80px";
  piece.style.left = touch.clientX - canvas.getBoundingClientRect().left - 40 + "px";
  piece.style.top  = touch.clientY - canvas.getBoundingClientRect().top - 40 + "px";
  piece.setAttribute("data-scale", 1);
  piece.setAttribute("data-rotation", 0);
  piece.style.zIndex = 10;
  canvas.appendChild(piece);

  dragElementTouch(piece, touch);
}

// ===== Funciones de movimiento =====
function dragElement(element, eStart) {
  let startX = eStart.clientX;
  let startY = eStart.clientY;
  let rect = element.getBoundingClientRect();
  let offsetX = startX - rect.left;
  let offsetY = startY - rect.top;

  function move(e) {
    let x = e.clientX - canvas.getBoundingClientRect().left - offsetX;
    let y = e.clientY - canvas.getBoundingClientRect().top - offsetY;
    
    // Limitar dentro del canvas
    x = Math.max(0, Math.min(x, canvas.clientWidth - element.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - element.offsetHeight));

    element.style.left = x + "px";
    element.style.top  = y + "px";
  }

  function up() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);

  // Escalar y rotar con rueda
  element.addEventListener("wheel", scaleRotate);
}

function dragElementTouch(element, touchStart) {
  function move(e) {
    const touch = e.touches[0];
    let x = touch.clientX - canvas.getBoundingClientRect().left - element.offsetWidth/2;
    let y = touch.clientY - canvas.getBoundingClientRect().top - element.offsetHeight/2;

    x = Math.max(0, Math.min(x, canvas.clientWidth - element.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - element.offsetHeight));

    element.style.left = x + "px";
    element.style.top  = y + "px";
  }

  function end() {
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  }

  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend", end);

  element.addEventListener("wheel", scaleRotate);
}

// ===== Escalar y rotar con rueda =====
function scaleRotate(ev) {
  ev.preventDefault();
  let element = ev.target;
  let scale = parseFloat(element.getAttribute("data-scale")) || 1;
  let rotation = parseFloat(element.getAttribute("data-rotation")) || 0;

  if (ev.shiftKey) rotation += ev.deltaY < 0 ? 5 : -5;
  else {
    scale += ev.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.1, scale);
  }

  element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  element.setAttribute("data-scale", scale);
  element.setAttribute("data-rotation", rotation);
}

// ===== Descargar canvas =====
downloadBtn.addEventListener("click", () => {
  html2canvas(canvas).then(canvasExport => {
    const link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvasExport.toDataURL("image/png");
    link.click();
  });
  alert("¡Descargalo con garra! 🎉");
});










