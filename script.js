const iniciales = [
  {
    id: "1001234567",
    nombre: "Juan Pablo Pérez",
    documento: "1001234567",
    grado: "10°",
    tipoSangre: "O+",
    alergias: "Penicilina",
    tutor: "Carlos Pérez (3001234567)"
  },
  {
    id: "1009876543",
    nombre: "María Camargo",
    documento: "1009876543",
    grado: "6°A",
    tipoSangre: "A+",
    alergias: "Ninguna",
    tutor: "Ana Camargo (3109876543)"
  }
];

let baseDatosEstudiantes = JSON.parse(localStorage.getItem("samgy_estudiantes")) || iniciales;

window.cambiarPestana = (nombrePestana) => {
  const secciones = document.querySelectorAll('.vista-seccion');
  secciones.forEach(sec => sec.classList.remove('activo'));

  const botones = document.querySelectorAll('.nav-btn');
  botones.forEach(btn => btn.classList.remove('activo'));

  const seccionActiva = document.getElementById(`vista-${nombrePestana}`);
  if (seccionActiva) {
    seccionActiva.classList.add('activo');
  }

  const btnActivo = Array.from(botones).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(nombrePestana));
  if (btnActivo) {
    btnActivo.classList.add('activo');
  }

  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu && dropdownMenu.classList.contains("active")) {
    dropdownMenu.classList.remove("active");
  }
};

function guardarEnStorage() {
  localStorage.setItem("samgy_estudiantes", JSON.stringify(baseDatosEstudiantes));
  renderizarDirectorio();
  actualizarMetricas();
}

function actualizarMetricas() {
  const metricTotal = document.getElementById("metricTotalEstudiantes");
  if (metricTotal) {
    metricTotal.textContent = baseDatosEstudiantes.length;
  }
}

function renderizarDirectorio() {
  const contenedorGrados = document.getElementById("contenedorGrados");
  if (!contenedorGrados) return;

  contenedorGrados.innerHTML = "";

  if (baseDatosEstudiantes.length === 0) {
    contenedorGrados.innerHTML = "<p style='padding: 10px;'>No hay fichas registradas en el sistema actualmente.</p>";
    return;
  }

  const porGrados = {};
  baseDatosEstudiantes.forEach(est => {
    const grado = est.grado;
    if (!porGrados[grado]) porGrados[grado] = [];
    porGrados[grado].push(est);
  });

  Object.keys(porGrados).forEach(grado => {
    const bloque = document.createElement("div");
    bloque.className = "bloque-grado";
    
    let tarjetasHTML = `<div class="grid-estudiantes">`;
    porGrados[grado].forEach(est => {
      tarjetasHTML += `
        <div class="casilla-ficha">
          <div class="casilla-ficha-header">
            <h4>${est.nombre}</h4>
          </div>
          <div class="casilla-body">
            <p><strong>Doc:</strong> ${est.documento}</p>
            <p><strong>Sangre:</strong> ${est.tipoSangre}</p>
            <p><strong>Alergias:</strong> ${est.alergias}</p>
            <p><strong>Tutor:</strong> ${est.tutor}</p>
          </div>
          <div class="acciones-casilla">
            <button class="btn-editar" onclick="cargarFormularioEdicion('${est.id}')">Editar</button>
            <button class="btn-eliminar" onclick="eliminarEstudiante('${est.id}', '${est.nombre.replace(/'/g, "\\'")}')">Eliminar</button>
          </div>
        </div>
      `;
    });
    tarjetasHTML += `</div>`;

    bloque.innerHTML = `<h4>Grado: ${grado} (${porGrados[grado].length} estudiantes)</h4>${tarjetasHTML}`;
    contenedorGrados.appendChild(bloque);
  });
}

window.cargarFormularioEdicion = function(id) {
  const estudiante = baseDatosEstudiantes.find(est => est.id === String(id));
  if (!estudiante) return;

  document.getElementById("regId").value = estudiante.id;
  document.getElementById("regNombre").value = estudiante.nombre;
  document.getElementById("regDocumento").value = estudiante.documento;
  document.getElementById("regGrado").value = estudiante.grado;
  document.getElementById("regSangre").value = estudiante.tipoSangre;
  document.getElementById("regAlergias").value = estudiante.alergias;
  document.getElementById("regTutor").value = estudiante.tutor;

  document.getElementById("tituloFormulario").textContent = `Editando Ficha de: ${estudiante.nombre}`;
  document.getElementById("btnGuardar").textContent = "Guardar Cambios";
  document.getElementById("btnCancelarEdicion").style.display = "inline-block";

  cambiarPestana('fichas');
};

window.eliminarEstudiante = function(id, nombre) {
  const confirmacion = confirm(`¿Deseas eliminar permanentemente la ficha médica de "${nombre}"?`);
  
  if (confirmacion) {
    baseDatosEstudiantes = baseDatosEstudiantes.filter(est => est.id !== String(id));
    guardarEnStorage();
    const mensajeResultado = document.getElementById("mensajeResultado");
    if (mensajeResultado) mensajeResultado.innerHTML = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const btnBuscar = document.getElementById("btnBuscar");
  const inputBusqueda = document.getElementById("inputBusqueda");
  const mensajeResultado = document.getElementById("mensajeResultado");
  const formEstudiante = document.getElementById("formEstudiante");
  const mensajeGuardado = document.getElementById("mensajeGuardado");
  const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("active");
    });
  }

  const realizarBusqueda = () => {
    const termino = inputBusqueda.value.trim().toLowerCase();

    if (termino === "") {
      mensajeResultado.style.color = "#d9534f";
      mensajeResultado.innerHTML = "⚠️ Ingresa un nombre o documento para buscar.";
      return;
    }

    const encontrado = baseDatosEstudiantes.find(est => 
      est.nombre.toLowerCase().includes(termino) || est.documento.includes(termino)
    );

    if (encontrado) {
      mensajeResultado.innerHTML = `
        <div style="background: #ffffff; border: 2px solid #4FB3D9; border-radius: 8px; padding: 15px; margin-top: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #03658C;">Ficha Médica Encontrada</h4>
          <p style="margin: 4px 0;"><strong>Estudiante:</strong> ${encontrado.nombre}</p>
          <p style="margin: 4px 0;"><strong>Documento:</strong> ${encontrado.documento}</p>
          <p style="margin: 4px 0;"><strong>Grado:</strong> ${encontrado.grado}</p>
          <p style="margin: 4px 0;"><strong>Sangre:</strong> ${encontrado.tipoSangre}</p>
          <p style="margin: 4px 0;"><strong>Alergias:</strong> ${encontrado.alergias}</p>
          <p style="margin: 4px 0;"><strong>Tutor:</strong> ${encontrado.tutor}</p>
          <button onclick="cargarFormularioEdicion('${encontrado.id}')" style="margin-top: 10px; background: #03658C; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">✏️ Editar esta Ficha</button>
        </div>
      `;
    } else {
      mensajeResultado.style.color = "#d9534f";
      mensajeResultado.innerHTML = `No existe ninguna ficha registrada para "${inputBusqueda.value}".`;
    }
  };

  if (btnBuscar) btnBuscar.addEventListener("click", realizarBusqueda);
  if (inputBusqueda) inputBusqueda.addEventListener("keypress", (e) => { if (e.key === "Enter") realizarBusqueda(); });

  if (formEstudiante) {
    formEstudiante.addEventListener("submit", (e) => {
      e.preventDefault();

      const idEditando = document.getElementById("regId").value;
      const nombre = document.getElementById("regNombre").value.trim();
      const documento = document.getElementById("regDocumento").value.trim();
      const grado = document.getElementById("regGrado").value;
      const tipoSangre = document.getElementById("regSangre").value.trim();
      const alergias = document.getElementById("regAlergias").value.trim();
      const tutor = document.getElementById("regTutor").value.trim();

      const confirmacion = confirm(
        idEditando 
          ? `¿Estás seguro de que deseas actualizar la información de "${nombre}"?`
          : `¿Estás seguro de que deseas guardar la ficha médica de "${nombre}"?`
      );

      if (!confirmacion) return;

      if (idEditando) {
        const indice = baseDatosEstudiantes.findIndex(est => est.id === idEditando);
        if (indice !== -1) {
          baseDatosEstudiantes[indice] = { id: idEditando, nombre, documento, grado, tipoSangre, alergias, tutor };
          mensajeGuardado.style.color = "#28a745";
          mensajeGuardado.innerHTML = `Ficha de <strong>${nombre}</strong> actualizada correctamente.`;
        }
      } else {
        const nuevoEstudiante = { id: Date.now().toString(), nombre, documento, grado, tipoSangre, alergias, tutor };
        baseDatosEstudiantes.push(nuevoEstudiante);
        mensajeGuardado.style.color = "#28a745";
        mensajeGuardado.innerHTML = `Ficha de <strong>${nombre}</strong> guardada exitosamente.`;
      }

      guardarEnStorage();
      resetearFormulario();
    });
  }

  function resetearFormulario() {
    formEstudiante.reset();
    document.getElementById("regId").value = "";
    document.getElementById("tituloFormulario").textContent = "Registrar Nuevo Estudiante";
    document.getElementById("btnGuardar").textContent = "Guardar Ficha en Sistema";
    btnCancelarEdicion.style.display = "none";
  }

  if (btnCancelarEdicion) btnCancelarEdicion.addEventListener("click", resetearFormulario);

  renderizarDirectorio();
  actualizarMetricas();
});
