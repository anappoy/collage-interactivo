// Referencias
const canvas = document.getElementById("canvas");
const pieces = document.querySelectorAll(".piece");
const downloadBtn = document.getElementById("downloadBtn");

// Verificación de canvas
if (!canvas) {
  console.error("No se encontró el canvas. Asegurate de agregar id='canvas' al div del stencil.");
}

// Función para hacer arrastrable dentro del canvas
function dragInsideCanvas(el) {
  el.addEventListener("mousedown", (ev) => {
    ev.preventDefault();
    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    function mouseMoveHandler(eMove) {
      el.style.left = eMove.clientX - canvas.getBoundingClientRect().left - offsetX + "px";
      el.style.top = eMove.clientY - canvas.getBoundingClientRect().top - offsetY + "px";
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  });

  // Escalar con rueda del mouse
  el.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    let scale = parseFloat(el.getAttribute("data-scale") || 1);

    if (ev.deltaY < 0) {
      scale += 0.1; // agrandar
    } else {
      scale = Math.max(0.1, scale - 0.1); // achicar
    }

    el.style.transform = `scale(${scale})`;
    el.setAttribute("data-scale", scale);
  });
}

// Agregar funcionalidad a las piezas del panel derecho
pieces.forEach(piece => {
  piece.addEventListener("mousedown", (e) => {
    e.preventDefault();

    // Clonar la pieza
    const newPiece = piece.cloneNode(true);
    newPiece.style.position = "absolute";
    newPiece.style.left = e.clientX - canvas.getBoundingClientRect().left - piece.width / 2 + "px";
    newPiece.style.top = e.clientY - canvas.getBoundingClientRect().top - piece.height / 2 + "px";
    newPiece.style.width = "120px"; // tamaño inicial
    newPiece.style.height = "auto";
    newPiece.setAttribute("data-scale", 1);

    // Agregar al canvas
    canvas.appendChild(newPiece);

    // Hacer arrastrable y escalable
    dragInsideCanvas(newPiece);
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

