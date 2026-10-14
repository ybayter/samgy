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
              <button className="
