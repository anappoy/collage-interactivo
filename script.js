// Referencias
const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");

// Verificación de canvas
if (!canvas) {
  console.error("No se encontró el canvas. Asegurate de agregar id='canvas' al div del stencil.");
}

// Permitir soltar sobre el canvas
canvas.addEventListener("dragover", (e) => {
  e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("text");
  const piece = document.getElementById(id);

  if (!piece) return;

  // Clonar la pieza para colocarla sobre el canvas
  const newPiece = piece.cloneNode(true);

  // Posición inicial
  newPiece.style.position = "absolute";
  newPiece.style.left = e.offsetX - piece.width / 2 + "px";
  newPiece.style.top = e.offsetY - piece.height / 2 + "px";
  newPiece.style.width = "120px"; // tamaño inicial
  newPiece.style.height = "auto";
  newPiece.setAttribute("data-scale", 1);

  // Escalar con la rueda del mouse
  newPiece.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    let scale = parseFloat(newPiece.getAttribute("data-scale") || 1);

    if (ev.deltaY < 0) {
      scale += 0.1; // agrandar
    } else {
      scale = Math.max(0.1, scale - 0.1); // achicar
    }

    newPiece.style.transform = `scale(${scale})`;
    newPiece.setAttribute("data-scale", scale);
  });

  // Hacer la pieza arrastrable dentro del canvas
  newPiece.addEventListener("mousedown", (ev) => {
    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    function mouseMoveHandler(eMove) {
      newPiece.style.left = eMove.clientX - canvas.getBoundingClientRect().left - offsetX + "px";
      newPiece.style.top = eMove.clientY - canvas.getBoundingClientRect().top - offsetY + "px";
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  });

  canvas.appendChild(newPiece);
});

// Hacer que las piezas originales se puedan arrastrar
pieces.forEach((piece) => {
  piece.setAttribute("draggable", true);

  piece.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.id);
  });
});

// Descargar el collage como imagen
downloadBtn.addEventListener("click", () => {
  html2canvas(canvas).then((canvasExport) => {
    const link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvasExport.toDataURL("image/png");
    link.click();
  });

  alert("¡Descargalo con garra! 🎉");
});
