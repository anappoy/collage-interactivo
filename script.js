document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".piece");
  const canvas = document.getElementById("canvas");

  .stencil {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* 👈 esto lo hace "invisible" a los clics */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; /* stencil al fondo */
}
.cloned {
  position: absolute;
  z-index: 10; /* clones arriba del stencil */
  cursor: move;
}


  // Crear clon arrastrable
  function createDraggableClone(piece) {
    const clone = piece.cloneNode(true);
    clone.classList.add("cloned");
    clone.style.position = "absolute";
    clone.style.left = "50px";
    clone.style.top = "50px";
    clone.style.width = "80px";
    clone.style.height = "80px";
    clone.style.cursor = "move";

    let offsetX, offsetY, isDragging = false;

    // Mouse down → empezar a arrastrar
    clone.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      clone.style.zIndex = 1000;
    });

    // Mouse move → mover mientras arrastro
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;

        // Limitar dentro del canvas
        x = Math.max(0, Math.min(x, rect.width - clone.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - clone.offsetHeight));

        clone.style.left = `${x}px`;
        clone.style.top = `${y}px`;
      }
    });

    // Mouse up → soltar
    document.addEventListener("mouseup", () => {
      isDragging = false;
      clone.style.zIndex = 10;
    });

    canvas.appendChild(clone);
  }

  // Click en pieza para clonar
  pieces.forEach((piece) => {
    piece.addEventListener("click", () => {
      createDraggableClone(piece);
    });
  });

  // Botón descargar
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      html2canvas(canvas).then((canvasEl) => {
        const link = document.createElement("a");
        link.download = "collage.png";
        link.href = canvasEl.toDataURL("image/png");
        link.click();
      });
    });
  }
});

});



