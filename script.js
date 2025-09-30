canvas.addEventListener("drop", e => {
  e.preventDefault();
  const id = e.dataTransfer.getData("text");
  const piece = document.getElementById(id);

  if (!piece) return;

  // Crear clon
  const newPiece = piece.cloneNode(true);

  const rect = canvas.getBoundingClientRect();
  newPiece.style.position = "absolute";
  newPiece.style.left = e.clientX - rect.left - piece.width / 2 + "px";
  newPiece.style.top = e.clientY - rect.top - piece.height / 2 + "px";
  newPiece.style.cursor = "move";

  // Atributos iniciales
  newPiece.setAttribute("data-scale", 1);
  newPiece.setAttribute("data-rotation", 0);

  // Arrastrar dentro del canvas
  let isDragging = false;
  let offsetX, offsetY;

  newPiece.addEventListener("mousedown", ev => {
    isDragging = true;
    offsetX = ev.offsetX;
    offsetY = ev.offsetY;
    newPiece.style.zIndex = Date.now();
  });

  document.addEventListener("mousemove", ev => {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      newPiece.style.left = ev.clientX - rect.left - offsetX + "px";
      newPiece.style.top = ev.clientY - rect.top - offsetY + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Escalar y rotar con la rueda
  newPiece.addEventListener("wheel", ev => {
    ev.preventDefault();
    let scale = parseFloat(newPiece.getAttribute("data-scale"));
    let rotation = parseFloat(newPiece.getAttribute("data-rotation"));

    if (ev.shiftKey) {
      rotation += ev.deltaY < 0 ? 5 : -5;
    } else {
      scale += ev.deltaY < 0 ? 0.1 : -0.1;
      scale = Math.max(0.1, scale);
    }

    newPiece.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    newPiece.setAttribute("data-scale", scale);
    newPiece.setAttribute("data-rotation", rotation);
  });

  // Agregar al canvas
  canvas.appendChild(newPiece);
});

  alert("¡Descargalo con garra! 🎉");
});



