document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".piece");
  const stencilContainer = document.getElementById("stencil-container");

  // función para crear clon arrastrable
  function createDraggableClone(piece) {
    const clone = piece.cloneNode(true);
    clone.classList.add("cloned");
    clone.style.position = "absolute";
    clone.style.left = "50px";
    clone.style.top = "50px";
    clone.style.maxWidth = "100px"; // 👈 tamaño fijo
    clone.style.maxHeight = "100px";
    clone.draggable = true;

    // eventos de arrastre
    clone.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", null);
      e.target.classList.add("dragging");
    });

    clone.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");

      // posición donde soltó el mouse
      const rect = stencilContainer.getBoundingClientRect();
      const x = e.pageX - rect.left - clone.offsetWidth / 2;
      const y = e.pageY - rect.top - clone.offsetHeight / 2;

      // limitar dentro del stencil
      clone.style.left = `${Math.max(0, Math.min(x, rect.width - clone.offsetWidth))}px`;
      clone.style.top = `${Math.max(0, Math.min(y, rect.height - clone.offsetHeight))}px`;
    });

    stencilContainer.appendChild(clone);
  }

  // click en pieza para clonar
  pieces.forEach((piece) => {
    piece.addEventListener("click", () => {
      createDraggableClone(piece);
    });
  });

  // botón descargar como imagen
  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      html2canvas(stencilContainer).then((canvas) => {
        const link = document.createElement("a");
        link.download = "stencil.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  }
});



