const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");

// Permitir soltar sobre el canvas
canvas.addEventListener("dragover", (e) => {
  e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("text");
  const piece = document.getElementById(id);
  const newPiece = piece.cloneNode(true);

  newPiece.style.position = "absolute";
  newPiece.style.left = e.offsetX - piece.width / 2 + "px";
  newPiece.style.top = e.offsetY - piece.height / 2 + "px";

  // Hacer que la pieza clonada también se pueda escalar
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
});


downloadBtn.addEventListener('click', () => {
  alert("¡Descargalo con garra! 🎉");
});

