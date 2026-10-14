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

function App() {
  const [vistaActiva, setVistaActiva] = React.useState('inicio');
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  
  const [estudiantes, setEstudiantes] = React.useState(() => {
    const saved = localStorage.getItem('samgy_estudiantes');
    return saved ? JSON.parse(saved) : datosIniciales;
  });

  const [consultas, setConsultas] = React.useState(() => {
    const saved = localStorage.getItem('samgy_consultas');
    return saved ? JSON.parse(saved) : [];
  });

  const [busqueda, setBusqueda] = React.useState('');
  const [editIndex, setEditIndex] = React.useState(-1);
  
  const [formEstudiante, setFormEstudiante] = React.useState({
    nombre: '', documento: '', grado: '', tipoSangre: '', alergias: '', tutor: ''
  });

  const [formConsulta, setFormConsulta] = React.useState({
    estudiante: '', fecha: '', motivo: '', tratamiento: '', observaciones: ''
  });

  React.useEffect(() => {
    localStorage.setItem('samgy_estudiantes', JSON.stringify(estudiantes));
  }, [estudiantes]);

  React.useEffect(() => {
    localStorage.setItem('samgy_consultas', JSON.stringify(consultas));
  }, [consultas]);

  const handleGuardarEstudiante = (e) => {
    e.preventDefault();
    if (editIndex >= 0) {
      const actualizados = [...estudiantes];
      actualizados[editIndex] = formEstudiante;
      setEstudiantes(actualizados);
      setEditIndex(-1);
    } else {
      setEstudiantes([...estudiantes, formEstudiante]);
    }
    setFormEstudiante({ nombre: '', documento: '', grado: '', tipoSangre: '', alergias: '', tutor: '' });
    alert('Ficha guardada exitosamente.');
  };

  const handleEditarEstudiante = (index) => {
    setEditIndex(index);
    setFormEstudiante(estudiantes[index]);
    setVistaActiva('fichas');
  };

  const handleEliminarEstudiante = (index) => {
    if (window.confirm(`¿Deseas eliminar la ficha de ${estudiantes[index].nombre}?`)) {
      setEstudiantes(estudiantes.filter((_, i) => i !== index));
    }
  };

  const handleGuardarConsulta = (e) => {
    e.preventDefault();
    setConsultas([...consultas, formConsulta]);
    setFormConsulta({ estudiante: '', fecha: '', motivo: '', tratamiento: '', observaciones: '' });
    alert('Consulta registrada con éxito.');
  };

  const estudiantesFiltrados = estudiantes.filter(e => 
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.documento.includes(busqueda)
  );

  return (
    <div className="app-main-layout">
      {/* BARRA SUPERIOR Y MENÚ DE TRES RAYITAS */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.12 3.82-.26 5.6.87 1.34 1.34 2.87 1.34 4.4 0 5.52-4.25 10-9.5 10S2.5 18.52 2.5 13c0-1.53.47-3.06 1.34-4.4-1.38-1.78-1.66-5.02-.26-5.6 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26z"/>
                <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
              </svg>
            </div>
            <div>
              <div className="brand-title">
                <span className="brand-name">SAMGY</span>
                <span className="brand-badge">SALUD</span>
              </div>
              <div className="brand-subtitle">Colegio San Alberto Magno — Base de Datos Escolar</div>
            </div>
          </div>
          <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>&#9776;</button>
        </div>

        {/* MENÚ DESPLEGABLE AZUL CON ICONOS */}
        <nav className={`dropdown-menu ${menuAbierto ? 'active' : ''}`}>
          <ul>
            <li>
              <a onClick={() => { setVistaActiva('inicio'); setMenuAbierto(false); }}>
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                Inicio
              </a>
            </li>
            <li>
              <a onClick={() => { setVistaActiva('fichas'); setMenuAbierto(false); }}>
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h4"/><path d="M6 12h8"/><path d="M6 16h12"/></svg>
                Fichas Estudiantiles
              </a>
            </li>
            <li>
              <a onClick={() => { setVistaActiva('consultas'); setMenuAbierto(false); }}>
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                Nueva Consulta / Registro
              </a>
            </li>
            <li>
              <a onClick={() => { setVistaActiva('directorio'); setMenuAbierto(false); }}>
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Directorio por Grados
              </a>
            </li>
            <li>
              <a onClick={() => { setVistaActiva('reportes'); setMenuAbierto(false); }}>
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                Reportes
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* VISTA 1: INICIO */}
        {vistaActiva === 'inicio' && (
          <section className="vista-seccion">
            <div className="hero-banner">
              <span className="hero-tag">MÓDULO DE SALUD ESCOLAR</span>
              <h1 className="hero-title">Sistema SAMGY de Enfermería</h1>
              <p className="hero-description">Gestión inteligente, eficiente y digital para la organización y control sanitario de la comunidad estudiantil.</p>
              <button className="btn btn-white" onClick={() => setVistaActiva('fichas')}>Registrar Estudiante</button>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">TOTAL ESTUDIANTES</span>
                <span className="metric-value">{estudiantes.length}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">TOTAL CONSULTAS</span>
                <span className="metric-value">{consultas.length}</span>
              </div>
            </div>
          </section>
        )}

        {/* VISTA 2: FICHAS Y BÚSQUEDA COMPLETA */}
        {vistaActiva === 'fichas' && (
          <section className="vista-seccion">
            <h2>Módulo de Fichas Estudiantiles</h2>
            
            <div className="search-container">
              <h3>Consultar Ficha Médica Rápidamente</h3>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o número de documento..." 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && <button className="btn btn-secondary" onClick={() => setBusqueda('')}>Limpiar</button>}
              </div>

              <div className="resultado-container">
                {estudiantesFiltrados.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No se encontraron estudiantes.</p>
                ) : (
                  estudiantesFiltrados.map((est) => {
                    const idx = estudiantes.indexOf(est);
                    return (
                      <div key={idx} className="card-estudiante">
                        <div>
                          <h4>{est.nombre} — Grado: {est.grado}</h4>
                          <p><strong>Documento:</strong> {est.documento} | <strong>Tipo de Sangre:</strong> {est.tipoSangre}</p>
                          <p><strong>Alergias / Condición:</strong> {est.alergias} | <strong>Tutor:</strong> {est.tutor}</p>
                        </div>
                        <div className="card-estudiante-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEditarEstudiante(idx)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminarEstudiante(idx)}>Eliminar</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="form-container">
              <h3>{editIndex >= 0 ? "Editar Ficha de Estudiante" : "Registrar Nuevo Estudiante"}</h3>
              <form onSubmit={handleGuardarEstudiante} className="form-grid">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input type="text" placeholder="Ej: Alhan Kappel" required value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Documento de identidad</label>
                  <input type="text" placeholder="Ej: 1001234567" required value={formEstudiante.documento} onChange={e => setFormEstudiante({...formEstudiante, documento: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Grado escolar</label>
                  <select required value={formEstudiante.grado} onChange={e => setFormEstudiante({...formEstudiante, grado: e.target.value})}>
                    <option value="">Selecciona un grado...</option>
                    <option value="6°A">6°A</option>
                    <option value="7°A">7°A</option>
                    <option value="8°A">8°A</option>
                    <option value="9°A">9°A</option>
                    <option value="10°">10°</option>
                    <option value="11°">11°</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de sangre</label>
                  <input type="text" placeholder="Ej: O+" required value={formEstudiante.tipoSangre} onChange={e => setFormEstudiante({...formEstudiante, tipoSangre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Alergias / Condiciones</label>
                  <input type="text" placeholder="Ej: Penicilina o Ninguna" value={formEstudiante.alergias} onChange={e => setFormEstudiante({...formEstudiante, alergias: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nombre y Teléfono del Tutor</label>
                  <input type="text" placeholder="Ej: Carlos Pérez (3001234567)" required value={formEstudiante.tutor} onChange={e => setFormEstudiante({...formEstudiante, tutor: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editIndex >= 0 ? "Actualizar Ficha" : "Guardar Ficha"}</button>
                  {editIndex >= 0 && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditIndex(-1); setFormEstudiante({ nombre: '', documento: '', grado: '', tipoSangre: '', alergias: '', tutor: '' }); }}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {/* VISTA 3: NUEVA CONSULTA */}
        {vistaActiva === 'consultas' && (
          <section className="vista-seccion">
            <h2>Nueva Consulta / Registro de Enfermería</h2>
            <div className="form-container">
              <form onSubmit={handleGuardarConsulta} className="form-grid">
                <div className="form-group">
                  <label>Seleccionar Estudiante</label>
                  <select required value={formConsulta.estudiante} onChange={e => setFormConsulta({...formConsulta, estudiante: e.target.value})}>
                    <option value="">Seleccione un estudiante...</option>
                    {estudiantes.map((e, idx) => (
                      <option key={idx} value={e.nombre}>{e.nombre} ({e.grado}) - Doc: {e.documento}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha y Hora</label>
                  <input type="datetime-local" required value={formConsulta.fecha} onChange={e => setFormConsulta({...formConsulta, fecha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Síntomas / Motivo</label>
                  <input type="text" placeholder="Ej: Dolor de cabeza, Golpee..." required value={formConsulta.motivo} onChange={e => setFormConsulta({...formConsulta, motivo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tratamiento / Medicamento</label>
                  <input type="text" placeholder="Ej: Hielo, Reposo 15 min..." required value={formConsulta.tratamiento} onChange={e => setFormConsulta({...formConsulta, tratamiento: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Observaciones</label>
                  <textarea rows="3" placeholder="Ej: Se notifica al tutor..." value={formConsulta.observaciones} onChange={e => setFormConsulta({...formConsulta, observaciones: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Guardar Registro de Consulta</button>
                </div>
              </form>
            </div>

            <h3>Historial de Consultas Recientes</h3>
            <div className="tabla-container">
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
                  {consultas.slice().reverse().map((c, idx) => (
                    <tr key={idx}>
                      <td><strong>{c.estudiante}</strong></td>
                      <td>{c.fecha.replace("T", " ")}</td>
                      <td>{c.motivo}</td>
                      <td>{c.tratamiento}</td>
                      <td>{c.observaciones || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VISTA 4: DIRECTORIO */}
        {vistaActiva === 'directorio' && (
          <section className="vista-seccion">
            <h2>Directorio por Grados</h2>
            <p className="section-desc">Fichas activas clasificadas según el grado escolar.</p>
            {estudiantes.map((est, idx) => (
              <div key={idx} className="card-estudiante" style={{ marginTop: '8px' }}>
                <div>
                  <strong>{est.nombre}</strong> — Doc: {est.documento} | Sangre: {est.tipoSangre} | Alergias: {est.alergias}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminarEstudiante(idx)}>Eliminar</button>
              </div>
            ))}
          </section>
        )}

        {/* VISTA 5: REPORTES */}
        {vistaActiva === 'reportes' && (
          <section className="vista-seccion">
            <h2>Reportes Sanitarios y Estadísticas</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">TOTAL ESTUDIANTES</span>
                <span className="metric-value">{estudiantes.length}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">TOTAL CONSULTAS</span>
                <span className="metric-value">{consultas.length}</span>
              </div>
            </div>

            <div className="form-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Resumen General de Estudiantes</h3>
                <button className="btn btn-secondary" onClick={() => window.print()}>Imprimir / Exportar Reporte</button>
              </div>
              <div className="tabla-container">
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
                    {estudiantes.map((e, idx) => (
                      <tr key={idx}>
                        <td>{e.nombre}</td>
                        <td>{e.documento}</td>
                        <td>{e.grado}</td>
                        <td>{e.tipoSangre}</td>
                        <td>{e.alergias}</td>
                        <td>{e.tutor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer className="footer">
        <p>SAMGY Salud — Colegio San Alberto Magno &copy; 2026</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
