// ===== Selecciones principales =====
const canvas = document.getElementById("canvas");
const downloadBtn = document.getElementById("downloadBtn");
const piecesContainer = document.getElementById("pieces-container");

// ===== Ordenar panel derecho alfabéticamente por nombre y color =====
let piecesArray = Array.from(piecesContainer.children);

piecesArray.sort((a, b) => {
  const [nameA, colorA] = a.id.split('_');
  const [nameB, colorB] = b.id.split('_');
  if (nameA === nameB) return colorA.localeCompare(colorB);
  return nameA.localeCompare(nameB);
});

piecesContainer.innerHTML = "";
piecesArray.forEach(piece => piecesContainer.appendChild(piece));

// ===== Funciones de clonación =====
function createClone(e) {
  e.preventDefault();
  const piece = e.target.cloneNode(true);
  piece.classList.add("cloned");
  piece.style.position = "absolute";
  piece.style.width = "80px";
  piece.style.height = "auto";

  piece.style.left = e.clientX - canvas.getBoundingClientRect().left - 40 + "px";
  piece.style.top  = e.clientY - canvas.getBoundingClientRect().top - 40 + "px";

  piece.setAttribute("data-scale", 1);
  piece.setAttribute("data-rotation", 0);
  piece.style.zIndex = 10;

  canvas.appendChild(piece);
  enableDrag(piece);
}

function createCloneTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const piece = e.target.cloneNode(true);
  piece.classList.add("cloned");
  piece.style.position = "absolute";
  piece.style.width = "80px";
  piece.style.height = "auto";

  piece.style.left = touch.clientX - canvas.getBoundingClientRect().left - 40 + "px";
  piece.style.top  = touch.clientY - canvas.getBoundingClientRect().top - 40 + "px";

  piece.setAttribute("data-scale", 1);
  piece.setAttribute("data-rotation", 0);
  piece.style.zIndex = 10;

  canvas.appendChild(piece);
  enableDrag(piece);
}

// ===== Asignar listeners a piezas del panel derecho =====
piecesArray.forEach(piece => {
  piece.addEventListener("mousedown", createClone);
  piece.addEventListener("touchstart", createCloneTouch, {passive:false});
});

// ===== Función para habilitar drag y touch a cualquier clon =====
function enableDrag(element) {
  element.addEventListener("mousedown", dragStart);
  element.addEventListener("touchstart", dragStartTouch, {passive:false});
  element.addEventListener("wheel", scaleRotate);
}

// ===== Drag con mouse =====
function dragStart(e) {
  e.preventDefault();
  const element = e.target;
  let offsetX = e.clientX - element.getBoundingClientRect().left;
  let offsetY = e.clientY - element.getBoundingClientRect().top;

  function move(eMove) {
    let x = eMove.clientX - canvas.getBoundingClientRect().left - offsetX;
    let y = eMove.clientY - canvas.getBoundingClientRect().top - offsetY;

    x = Math.max(0, Math.min(x, canvas.clientWidth - element.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - element.offsetHeight));

    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  function up() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
}

// ===== Drag con touch =====
function dragStartTouch(e) {
  e.preventDefault();
  const element = e.target;
  const touch = e.touches[0];
  let offsetX = touch.clientX - element.getBoundingClientRect().left;
  let offsetY = touch.clientY - element.getBoundingClientRect().top;

  function move(eMove) {
    const touchMove = eMove.touches[0];
    let x = touchMove.clientX - canvas.getBoundingClientRect().left - offsetX;
    let y = touchMove.clientY - canvas.getBoundingClientRect().top - offsetY;

    x = Math.max(0, Math.min(x, canvas.clientWidth - element.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - element.offsetHeight));

    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  function end() {
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  }

  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend", end);
}

// ===== Escalar y rotar con rueda =====
function scaleRotate(ev) {
  ev.preventDefault();
  const element = ev.target;
  let scale = parseFloat(element.getAttribute("data-scale")) || 1;
  let rotation = parseFloat(element.getAttribute("data-rotation")) || 0;

  if (ev.altKey) rotation += ev.deltaY < 0 ? 5 : -5; // ALT para rotar
  else {
    scale += ev.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.1, scale);
  }

  element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  element.setAttribute("data-scale", scale);
  element.setAttribute("data-rotation", rotation);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Delete" || e.key === "Backspace") {
    const selected = document.querySelector(".selected");
    if (selected) selected.remove();
  }
});

// Para marcar un clon como seleccionado al hacer click
canvas.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cloned")) return;
  document.querySelectorAll(".cloned").forEach(el => el.classList.remove("selected"));
  e.target.classList.add("selected");

  // Orden z-index
  if (e.ctrlKey) e.target.style.zIndex = Math.max(1, parseInt(e.target.style.zIndex) - 1);
  else e.target.style.zIndex = parseInt(e.target.style.zIndex) + 1;
});

// ===== Click para traer adelante/enviar atrás =====
canvas.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cloned")) return;
  if (e.ctrlKey) { // Ctrl + click → enviar atrás
    e.target.style.zIndex = Math.max(1, parseInt(e.target.style.zIndex) - 1);
  } else { // click normal → traer adelante
    e.target.style.zIndex = parseInt(e.target.style.zIndex) + 1;
  }
});



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








