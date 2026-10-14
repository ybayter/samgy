import React, { useState, useEffect } from 'react';
import './App.css';

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

export default function App() {
  const [vistaActiva, setVistaActiva] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const [estudiantes, setEstudiantes] = useState(() => {
    const saved = localStorage.getItem('samgy_estudiantes');
    return saved ? JSON.parse(saved) : datosIniciales;
  });

  const [consultas, setConsultas] = useState(() => {
    const saved = localStorage.getItem('samgy_consultas');
    return saved ? JSON.parse(saved) : [];
  });


  const [busqueda, setBusqueda] = useState('');

 
  const [editIndex, setEditIndex] = useState(-1);
  const [formEstudiante, setFormEstudiante] = useState({
    nombre: '',
    documento: '',
    grado: '',
    tipoSangre: '',
    alergias: '',
    tutor: ''
  });

  
  const [formConsulta, setFormConsulta] = useState({
    estudiante: '',
    fecha: '',
    motivo: '',
    tratamiento: '',
    observaciones: ''
  });

  useEffect(() => {
    localStorage.setItem('samgy_estudiantes', JSON.stringify(estudiantes));
  }, [estudiantes]);

  useEffect(() => {
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
    if (window.confirm(`¿Deseas eliminar a ${estudiantes[index].nombre}?`)) {
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
    <div className="app-container">
      {/* NAVBAR */}
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

        <nav className={`dropdown-menu ${menuAbierto ? 'active' : ''}`}>
          <ul>
            <li><a onClick={() => { setVistaActiva('inicio'); setMenuAbierto(false); }}>Inicio</a></li>
            <li><a onClick={() => { setVistaActiva('fichas'); setMenuAbierto(false); }}>Fichas Estudiantiles</a></li>
            <li><a onClick={() => { setVistaActiva('consultas'); setMenuAbierto(false); }}>Nueva Consulta / Registro</a></li>
            <li><a onClick={() => { setVistaActiva('directorio'); setMenuAbierto(false); }}>Directorio por Grados</a></li>
            <li><a onClick={() => { setVistaActiva('reportes'); setMenuAbierto(false); }}>Reportes</a></li>
          </ul>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* VISTA: INICIO */}
        {vistaActiva === 'inicio' && (
          <section className="vista-seccion activo">
            <div className="hero-banner">
              <span className="hero-tag">MÓDULO DE SALUD ESCOLAR</span>
              <h1 className="hero-title">Sistema SAMGY de Enfermería</h1>
              <p className="hero-description">Gestión inteligente, eficiente y digital para la comunidad estudiantil.</p>
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

        {/* VISTA: FICHAS */}
        {vistaActiva === 'fichas' && (
          <section className="vista-seccion activo">
            <h2>Módulo de Fichas Estudiantiles</h2>
            
            <div className="search-container">
              <h3>Consultar Ficha Médica Rápidamente</h3>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o documento..." 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="resultado-container">
                {estudiantesFiltrados.map((est) => {
                  const idx = estudiantes.indexOf(est);
                  return (
                    <div key={idx} className="card-estudiante">
                      <div>
                        <h4>{est.nombre} — Grado: {est.grado}</h4>
                        <p><strong>Doc:</strong> {est.documento} | <strong>Sangre:</strong> {est.tipoSangre}</p>
                        <p><strong>Alergias:</strong> {est.alergias} | <strong>Tutor:</strong> {est.tutor}</p>
                      </div>
                      <div className="card-estudiante-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditarEstudiante(idx)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarEstudiante(idx)}>Eliminar</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-container">
              <h3>{editIndex >= 0 ? "Editar Estudiante" : "Registrar Nuevo Estudiante"}</h3>
              <form onSubmit={handleGuardarEstudiante} className="form-grid">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input type="text" required value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Documento de identidad</label>
                  <input type="text" required value={formEstudiante.documento} onChange={e => setFormEstudiante({...formEstudiante, documento: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Grado escolar</label>
                  <select required value={formEstudiante.grado} onChange={e => setFormEstudiante({...formEstudiante, grado: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    <option value="6°A">6°A</option>
                    <option value="10°">10°</option>
                    <option value="11°">11°</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de sangre</label>
                  <input type="text" required value={formEstudiante.tipoSangre} onChange={e => setFormEstudiante({...formEstudiante, tipoSangre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Alergias</label>
                  <input type="text" value={formEstudiante.alergias} onChange={e => setFormEstudiante({...formEstudiante, alergias: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tutor</label>
                  <input type="text" required value={formEstudiante.tutor} onChange={e => setFormEstudiante({...formEstudiante, tutor: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editIndex >= 0 ? "Actualizar" : "Guardar"}</button>
                  {editIndex >= 0 && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditIndex(-1); setFormEstudiante({ nombre: '', documento: '', grado: '', tipoSangre: '', alergias: '', tutor: '' }); }}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {/* VISTA: CONSULTAS */}
        {vistaActiva === 'consultas' && (
          <section className="vista-seccion activo">
            <h2>Nueva Consulta / Registro de Enfermería</h2>
            <div className="form-container">
              <form onSubmit={handleGuardarConsulta} className="form-grid">
                <div className="form-group">
                  <label>Estudiante</label>
                  <select required value={formConsulta.estudiante} onChange={e => setFormConsulta({...formConsulta, estudiante: e.target.value})}>
                    <option value="">Seleccione...</option>
                    {estudiantes.map((e, idx) => (
                      <option key={idx} value={e.nombre}>{e.nombre} ({e.grado})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha y Hora</label>
                  <input type="datetime-local" required value={formConsulta.fecha} onChange={e => setFormConsulta({...formConsulta, fecha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Motivo</label>
                  <input type="text" required value={formConsulta.motivo} onChange={e => setFormConsulta({...formConsulta, motivo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tratamiento</label>
                  <input type="text" required value={formConsulta.tratamiento} onChange={e => setFormConsulta({...formConsulta, tratamiento: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Guardar Consulta</button>
                </div>
              </form>
            </div>

            <h3>Historial de Consultas Recientes</h3>
            <div className="tabla-container">
              <table>
                <thead>
                  <tr><th>Estudiante</th><th>Fecha</th><th>Motivo</th><th>Tratamiento</th></tr>
                </thead>
                <tbody>
                  {consultas.map((c, idx) => (
                    <tr key={idx}>
                      <td><strong>{c.estudiante}</strong></td>
                      <td>{c.fecha}</td>
                      <td>{c.motivo}</td>
                      <td>{c.tratamiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VISTA: DIRECTORIO */}
        {vistaActiva === 'directorio' && (
          <section className="vista-seccion activo">
            <h2>Directorio por Grados</h2>
            {estudiantes.map((est, idx) => (
              <div key={idx} className="card-estudiante" style={{ marginTop: '10px' }}>
                <div>
                  <strong>{est.nombre}</strong> (Grado {est.grado}) — Doc: {est.documento} | Sangre: {est.tipoSangre}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminarEstudiante(idx)}>Eliminar</button>
              </div>
            ))}
          </section>
        )}

        {/* VISTA: REPORTES */}
        {vistaActiva === 'reportes' && (
          <section className="vista-seccion activo">
            <h2>Reportes Sanitarios</h2>
            <div className="form-container">
              <button className="btn btn-secondary" onClick={() => window.print()}>Imprimir / Exportar Reporte</button>
              <div className="tabla-container" style={{ marginTop: '16px' }}>
                <table>
                  <thead>
                    <tr><th>Nombre</th><th>Documento</th><th>Grado</th><th>Sangre</th><th>Alergias</th></tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((e, idx) => (
                      <tr key={idx}>
                        <td>{e.nombre}</td>
                        <td>{e.documento}</td>
                        <td>{e.grado}</td>
                        <td>{e.tipoSangre}</td>
                        <td>{e.alergias}</td>
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
