const iniciales = [
  {
    id: "1001234567",
    nombre: "Juan Pablo Pérez",
    documento: "1001234567",
    grado: "10°",
    tipoSangre: "O+",
    alergias: "Penicilina",
    tutor: "Carlos Pérez (3001234567)"
  }
];

let baseDatosEstudiantes = JSON.parse(localStorage.getItem("samgy_estudiantes")) || iniciales;

window.cambiarPestana = (nombrePestana) => {
  const secciones = document.querySelectorAll('.vista-seccion');
  secciones.forEach(sec => sec.classList.remove('activo'));

  const seccionActiva = document.getElementById(`vista-${nombrePestana}`);
  if (seccionActiva) {
    seccionActiva.classList.add('activo');
  }

  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu) {
    dropdownMenu.classList.remove("active");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function renderizarDirectorio() {
  const contenedorGrados = document.getElementById("contenedorGrados");
  if (!contenedorGrados) return;

  contenedorGrados.innerHTML = "";

  if (baseDatosEstudiantes.length === 0) {
    contenedorGrados.innerHTML = "<p>No hay fichas registradas.</p>";
    return;
  }

  const porGrados = {};
  baseDatosEstudiantes.forEach(est => {
    if (!porGrados[est.grado]) porGrados[est.grado] = [];
    porGrados[est.grado].push(est);
  });

  Object.keys(porGrados).forEach(grado => {
    const bloque = document.createElement("div");
    bloque.style.marginBottom = "20px";
    bloque.innerHTML = `<h3>Grado ${grado}</h3>`;
    
    porGrados[grado].forEach(est => {
      bloque.innerHTML += `
        <div style="background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 8px;">
          <strong>${est.nombre}</strong> - Doc: ${est.documento} - Sangre: ${est.tipoSangre}
        </div>
      `;
    });
    contenedorGrados.appendChild(bloque);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("active");
    });
  }

  const metricTotal = document.getElementById("metricTotalEstudiantes");
  if (metricTotal) {
    metricTotal.textContent = baseDatosEstudiantes.length;
  }

  renderizarDirectorio();
});
