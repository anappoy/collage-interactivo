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
  piece.style.position = "absolute";
  piece.style.left = e.offsetX - piece.width/2 + "px";
  piece.style.top  = e.offsetY - piece.height/2 + "px";
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
  piece.style.position = "absolute";
  piece.style.left = touch.clientX - piece.width/2 + "px";
  piece.style.top  = touch.clientY - piece.height/2 + "px";
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
    element.style.left = e.clientX - offsetX + "px";
    element.style.top  = e.clientY - offsetY + "px";
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
    element.style.left = touch.clientX - element.width/2 + "px";
    element.style.top  = touch.clientY - element.height/2 + "px";
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

  element


