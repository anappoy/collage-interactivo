const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");

// ===== Crear clon y arrastrar =====
pieces.forEach(piece => {
  piece.addEventListener("mousedown", startDrag);
  piece.addEventListener("touchstart", startDragTouch, {passive:false});
});

function startDrag(e) {
  e.preventDefault();
  const clone = pieceClone(e.target, e.clientX, e.clientY);
  canvas.appendChild(clone);
  dragElement(clone, e);
}

function startDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const clone = pieceClone(e.target, touch.clientX, touch.clientY);
  canvas.appendChild(clone);
  dragElementTouch(clone, touch);
}

function pieceClone(piece, x, y) {
  const clone = piece.cloneNode(true);
  clone.classList.add("cloned");
  clone.style.left = x - 40 + "px"; // 40 = mitad de 80px
  clone.style.top  = y - 40 + "px";
  clone.setAttribute("data-scale", 1);
  clone.setAttribute("data-rotation", 0);
  return clone;
}

// ===== Drag con mouse =====
function dragElement(element, eStart) {
  let offsetX = eStart.clientX - element.getBoundingClientRect().left;
  let offsetY = eStart.clientY - element.getBoundingClientRect().top;

  function move(e) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Limitar dentro canvas
    const rect = canvas.getBoundingClientRect();
    x = Math.max(0, Math.min(x, rect.width - element.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - element.offsetHeight));

    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  function up() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  element.addEventListener("wheel", scaleRotate);
}

// ===== Drag con touch =====
function dragElementTouch(element, touchStart) {
  function move(e) {
    const touch = e.touches[0];
    let x = touch.clientX - 40;
    let y = touch.clientY - 40;

    const rect = canvas.getBoundingClientRect();
    x = Math.max(0, Math.min(x, rect.width - element.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - element.offsetHeight));

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

// ===== Escalar y rotar =====
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

// ===== Descargar =====
downloadBtn.addEventListener("click", () => {
  html2canvas(canvas).then(canvasExport => {
    const link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvasExport.toDataURL("image/png");
    link.click();
  });
  alert("¡Descargalo con garra! 🎉");
});











