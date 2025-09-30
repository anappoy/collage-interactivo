document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".piece");
  const canvas = document.getElementById("canvas");

  function createDraggableClone(piece) {
    const clone = piece.cloneNode(true);
    clone.classList.add("cloned");
    clone.style.position = "absolute";
    clone.style.left = "50px";
    clone.style.top = "50px";
    clone.style.width = "80px";
    clone.style.height = "80px";
    clone.style.cursor = "move";

    let offsetX = 0, offsetY = 0, isDragging = false;

    clone.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = clone.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      clone.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left - offsetX;
      let y = e.clientY - rect.top - offsetY;

      x = Math.max(0, Math.min(x, rect.width - clone.offsetWidth));
      y = Math.max(0, Math.min(y, rect.height - clone.offsetHeight));

      clone.style.left = `${x}px`;
      clone.style.top = `${y}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        clone.style.zIndex = 10;
      }
    });

    canvas.appendChild(clone);
  }

  pieces.forEach((piece) => {
    piece.addEventListener("click", () => {
      createDraggableClone(piece);
    });
  });

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





