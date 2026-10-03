const datosIniciales = [
  {
    nombre: "Alhan Kappel",
    documento: "1001234567",
    grado: "11°",
    tipoSangre: "O+",
    alergias: "Ninguna",
    tutor: "Carlos Pérez (3001234567)"
  },
  {
    nombre: "María Gómez",
    documento: "1009876543",
    grado: "10°",
    tipoSangre: "A+",
    alergias: "Penicilina",
    tutor: "Ana Gómez (3119876543)"
  }
];

let baseDatosEstudiantes = JSON.parse(localStorage.getItem("samgy_estudiantes")) || datosIniciales;
let historialConsultas = JSON.parse(localStorage.getItem("samgy_consultas")) || [];

function guardarEnLocalStorage() {
  localStorage.setItem("samgy_estudiantes", JSON.stringify(baseDatosEstudiantes));
  localStorage.setItem("samgy_consultas", JSON.stringify(historialConsultas));
}

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

  actualizarInterfaz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function actualizarInterfaz() {
  actualizarMetricas();
  renderizarBusqueda();
  poblarSelectEstudiantes();
  renderizarConsultas();
  renderizarDirectorio();
  renderizarReportes();
}

function actualizarMetricas() {
  const elemTotalE = document.getElementById("metricTotalEstudiantes");
  const elemTotalC = document.getElementById("metricTotalConsultas");
  if (elemTotalE) elemTotalE.textContent = baseDatosEstudiantes.length;
  if (elemTotalC) elemTotalC.textContent = historialConsultas.length;
}

function renderizarBusqueda(filtro = "") {
  const contenedor = document.getElementById("mensajeResultado");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const filtrados = baseDatosEstudiantes.filter(est => 
    est.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    est.documento.includes(filtro)
  );

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p style='color: var(--text-muted); padding: 10px;'>No se encontraron resultados.</p>";
    return;
  }

  filtrados.forEach((est) => {
    const originalIndex = baseDatosEstudiantes.indexOf(est);
    const card = document.createElement("div");
    card.className = "card-estudiante";
    card.innerHTML = `
      <div class="card-estudiante-info">
        <h4>${est.nombre} — Grado: ${est.grado}</h4>
        <p><strong>Documento:</strong> ${est.documento} | <strong>Tipo de Sangre:</strong> ${est.tipoSangre}</p>
        <p><strong>Alergias / Condición:</strong> ${est.alergias} | <strong>Tutor:</strong> ${est.tutor}</p>
      </div>
      <div class="card-estudiante-actions">
        <button class="btn btn-secondary btn-sm" onclick="editarEstudiante(${originalIndex})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${originalIndex})">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

window.eliminarEstudiante = (index) => {
  if (confirm(`¿Estás seguro de que deseas eliminar a ${baseDatosEstudiantes[index].nombre}?`)) {
    baseDatosEstudiantes.splice(index, 1);
    guardarEnLocalStorage();
    actualizarInterfaz();
  }
};

window.editarEstudiante = (index) => {
  const est = baseDatosEstudiantes[index];
  document.getElementById("regIndex").value = index;
  document.getElementById("regNombre").value = est.nombre;
  document.getElementById("regDocumento").value = est.documento;
  document.getElementById("regGrado").value = est.grado;
  document.getElementById("regSangre").value = est.tipoSangre;
  document.getElementById("regAlergias").value = est.alergias;
  document.getElementById("regTutor").value = est.tutor;

  document.getElementById("tituloFormulario").textContent = "Editar Ficha de Estudiante";
  document.getElementById("btnGuardar").textContent = "Actualizar Ficha";
  document.getElementById("btnCancelarEdicion").style.display = "inline-block";

  window.scrollTo({ top: document.getElementById("formEstudiante").offsetTop - 100, behavior: 'smooth' });
};

function poblarSelectEstudiantes() {
  const select = document.getElementById("consultaEstudiante");
  if (!select) return;

  select.innerHTML = '<option value="">Seleccione un estudiante...</option>';
  baseDatosEstudiantes.forEach(est => {
    select.innerHTML += `<option value="${est.nombre}">${est.nombre} (${est.grado}) - Doc: ${est.documento}</option>`;
  });
}

function renderizarConsultas() {
  const contenedor = document.getElementById("listaConsultas");
  if (!contenedor) return;

  if (historialConsultas.length === 0) {
    contenedor.innerHTML = "<p style='color: var(--text-muted);'>No hay consultas registradas.</p>";
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Fecha / Hora</th>
          <th>Motivo</th>
          <th>Tratamiento</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  historialConsultas.slice().reverse().forEach(c => {
    html += `
      <tr>
        <td><strong>${c.estudiante}</strong></td>
        <td>${c.fecha.replace("T", " ")}</td>
        <td>${c.motivo}</td>
        <td>${c.tratamiento}</td>
        <td>${c.observaciones || '-'}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  contenedor.innerHTML = html;
}

function renderizarDirectorio() {
  const contenedorGrados = document.getElementById("contenedorGrados");
  if (!contenedorGrados) return;

  contenedorGrados.innerHTML = "";

  if (baseDatosEstudiantes.length === 0) {
    contenedorGrados.innerHTML = "<p style='color: var(--text-muted);'>No hay fichas registradas.</p>";
    return;
  }

  const porGrados = {};
  baseDatosEstudiantes.forEach(est => {
    if (!porGrados[est.grado]) porGrados[est.grado] = [];
    porGrados[est.grado].push(est);
  });

  Object.keys(porGrados).sort().forEach(grado => {
    const bloque = document.createElement("div");
    bloque.style.marginBottom = "24px";
    bloque.innerHTML = `<h3 style="margin-bottom: 10px;">Grado ${grado}</h3>`;
    
    porGrados[grado].forEach(est => {
      const idx = baseDatosEstudiantes.indexOf(est);
      bloque.innerHTML += `
        <div class="card-estudiante" style="margin-top: 8px;">
          <div>
            <strong>${est.nombre}</strong> — Doc: ${est.documento} | Sangre: ${est.tipoSangre} | Alergias: ${est.alergias}
          </div>
          <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${idx})">Eliminar</button>
        </div>
      `;
    });
    contenedorGrados.appendChild(bloque);
  });
}

function renderizarReportes() {
  const rTotalE = document.getElementById("repTotalEstud");
  const rTotalC = document.getElementById("repTotalConsultas");
  const rAlergias = document.getElementById("repConAlergias");

  if (rTotalE) rTotalE.textContent = baseDatosEstudiantes.length;
  if (rTotalC) rTotalC.textContent = historialConsultas.length;

  const conAlergias = baseDatosEstudiantes.filter(e => e.alergias.toLowerCase() !== "ninguna" && e.alergias.trim() !== "").length;
  if (rAlergias) rAlergias.textContent = conAlergias;

  const tablaReportes = document.getElementById("tablaReportes");
  if (!tablaReportes) return;

  let html = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Documento</th>
          <th>Grado</th>
          <th>Tipo Sangre</th>
          <th>Alergias</th>
          <th>Tutor</th>
        </tr>
      </thead>
      <tbody>
  `;

  baseDatosEstudiantes.forEach(e => {
    html += `
      <tr>
        <td>${e.nombre}</td>
        <td>${e.documento}</td>
        <td>${e.grado}</td>
        <td>${e.tipoSangre}</td>
        <td>${e.alergias}</td>
        <td>${e.tutor}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  tablaReportes.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("active");
    });
  }

  // EVENTOS DE BÚSQUEDA
  const btnBuscar = document.getElementById("btnBuscar");
  const inputBusqueda = document.getElementById("inputBusqueda");
  const btnLimpiarBusqueda = document.getElementById("btnLimpiarBusqueda");

  if (btnBuscar && inputBusqueda) {
    btnBuscar.addEventListener("click", () => renderizarBusqueda(inputBusqueda.value));
    inputBusqueda.addEventListener("keyup", (e) => renderizarBusqueda(e.target.value));
  }

  if (btnLimpiarBusqueda) {
    btnLimpiarBusqueda.addEventListener("click", () => {
      inputBusqueda.value = "";
      renderizarBusqueda("");
    });
  }

  // FORMULARIO DE REGISTRO / EDICIÓN ESTUDIANTE
  const formEstudiante = document.getElementById("formEstudiante");
  if (formEstudiante) {
    formEstudiante.addEventListener("submit", (e) => {
      e.preventDefault();
      const index = parseInt(document.getElementById("regIndex").value);

      const estudiante = {
        nombre: document.getElementById("regNombre").value.trim(),
        documento: document.getElementById("regDocumento").value.trim(),
        grado: document.getElementById("regGrado").value,
        tipoSangre: document.getElementById("regSangre").value.trim(),
        alergias: document.getElementById("regAlergias").value.trim() || "Ninguna",
        tutor: document.getElementById("regTutor").value.trim()
      };

      if (index >= 0) {
        baseDatosEstudiantes[index] = estudiante;
      } else {
        baseDatosEstudiantes.push(estudiante);
      }

      guardarEnLocalStorage();
      formEstudiante.reset();
      document.getElementById("regIndex").value = -1;
      document.getElementById("tituloFormulario").textContent = "Registrar Nuevo Estudiante";
      document.getElementById("btnGuardar").textContent = "Guardar Ficha";
      document.getElementById("btnCancelarEdicion").style.display = "none";

      actualizarInterfaz();
      alert("Ficha guardada exitosamente.");
    });
  }

  const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
  if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", () => {
      formEstudiante.reset();
      document.getElementById("regIndex").value = -1;
      document.getElementById("tituloFormulario").textContent = "Registrar Nuevo Estudiante";
      document.getElementById("btnGuardar").textContent = "Guardar Ficha";
      btnCancelarEdicion.style.display = "none";
    });
  }

  // FORMULARIO DE NUEVA CONSULTA
  const formConsulta = document.getElementById("formConsulta");
  if (formConsulta) {
    formConsulta.addEventListener("submit", (e) => {
      e.preventDefault();
      const consulta = {
        estudiante: document.getElementById("consultaEstudiante").value,
        fecha: document.getElementById("consultaFecha").value,
        motivo: document.getElementById("consultaMotivo").value,
        tratamiento: document.getElementById("consultaTratamiento").value,
        observaciones: document.getElementById("consultaObservaciones").value
      };

      historialConsultas.push(consulta);
      guardarEnLocalStorage();
      formConsulta.reset();
      actualizarInterfaz();
      alert("Consulta registrada con éxito.");
    });
  }

  actualizarInterfaz();
});
