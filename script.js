const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedColor = null;

// ===== Selección de color =====
colorButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedColor = btn.getAttribute("data-color");
  });
});

// ===== Arrastrar y soltar piezas =====
pieces.forEach(piece => {
  piece.setAttribute("draggable", true);

  piece.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", e.target.id);
  });
});

canvas.addEventListener("dragover", e => e.preventDefault());

canvas.addEventListener("drop", e => {
  e.preventDefault();
  const id = e.dataTransfer.getData("text");
  const piece = document.getElementById(id);
  const newPiece = piece.cloneNode(true);

  const rect = canvas.getBoundingClientRect();
  newPiece.style.position = "absolute";
  newPiece.style.left = e.clientX - rect.left - piece.width/2 + "px";
  newPiece.style.top  = e.clientY - rect.top  - piece.height/2 + "px";

  // Escalar la pieza con la rueda del mouse
  newPiece.addEventListener("wheel", ev => {
    ev.preventDefault();
    let scale = parseFloat(newPiece.getAttribute("data-scale") || 1);
    if (ev.deltaY < 0) {
      scale += 0.1;
    } else {
      scale = Math.max(0.1, scale - 0.1);
    }
    newPiece.style.transform = `scale(${scale})`;
    newPiece.setAttribute("data-scale", scale);
  });

  // Aplicar color seleccionado (solo piezas negras)
  if (selectedColor) {
    switch(selectedColor) {
      case "black": newPiece.style.filter = "none"; break;
      case "red": newPiece.style.filter = "invert(19%) sepia(89%) saturate(4900%) hue-rotate(-5deg)"; break;
      case "green": newPiece.style.filter = "invert(30%) sepia(26%) saturate(350%) hue-rotate(78deg)"; break;
      case "blue": newPiece.style.filter = "invert(44%) sepia(24%) saturate(448%) hue-rotate(180deg)"; break;
      case "yellow": newPiece.style.filter = "invert(96%) sepia(50%) saturate(500%) hue-rotate(0deg)"; break;
    }
  }

  canvas.appendChild(newPiece);
});

// ===== Descargar el collage =====
downloadBtn.addEventListener("click", () => {
  html2canvas(canvas).then(canvasExport => {
    const link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvasExport.toDataURL("image/png");
    link.click();
  });

  alert("¡Descargalo con garra! 🎉");
});

});

});

