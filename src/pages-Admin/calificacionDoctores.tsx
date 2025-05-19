import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  idDoctor: number;
  idUsuario: number;
  licenciaMedica: string;
  idArea: number;
  especialidad: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  edad: number;
  direccion: string;
  estado: string;
  ciudad: string;
  areaNombre: string;
  areaDescripcion: string;
}

interface Cita {
  idCita: number;
  idDoctor: number;
  idUsuario: number;
  fechaHora: string;
  estadoCita: number;
  notas: string;
  calificacion: number;
  comentarios: string;
  fechaCalificacion: string;
  nombreDoctor: string;
  especialidadDoctor: string;
  nombrePaciente: string;
  estadoNombre: string;
}

const CalificacionesDoctores: React.FC = () => {
  const navigate = useNavigate();
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [citasDoctor, setCitasDoctor] = useState<Cita[]>([]);
  const [loadingDoctores, setLoadingDoctores] = useState(true);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        setLoadingDoctores(true);
        const response = await api.get('/Admin/Doctores');
        setDoctores(response.data);
        
        if (response.data.length > 0) {
          setSelectedDoctor(response.data[0]);
        }
      } catch (err) {
        console.error('Error al cargar doctores:', err);
        setError('No se pudieron cargar los doctores. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoadingDoctores(false);
      }
    };

    fetchDoctores();
  }, []);

  useEffect(() => {
    const fetchCitasDoctor = async () => {
      if (!selectedDoctor) return;
      
      try {
        setLoadingCitas(true);
        const response = await api.get(`/Citas/Doctor/${selectedDoctor.idDoctor}`);
        setCitasDoctor(response.data);
      } catch (err) {
        console.error(`Error al cargar citas del doctor ${selectedDoctor.idDoctor}:`, err);
        setError(`No se pudieron cargar las citas del doctor ${selectedDoctor.nombreCompleto}.`);
        setCitasDoctor([]);
      } finally {
        setLoadingCitas(false);
      }
    };

    fetchCitasDoctor();
  }, [selectedDoctor]);

  const formatearFechaHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularPromedioCalificacion = () => {
    const citasCalificadas = citasDoctor.filter(cita => cita.calificacion > 0);
    if (citasCalificadas.length === 0) return 0;
    
    const sumaCalificaciones = citasCalificadas.reduce((suma, cita) => suma + cita.calificacion, 0);
    return sumaCalificaciones / citasCalificadas.length;
  };

  const renderizarEstrellas = (calificacion: number) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`bi ${i < calificacion ? 'bi-star-fill' : 'bi-star'} text-warning`}
          ></i>
        ))}
        <span className="ms-1">({calificacion})</span>
      </div>
    );
  };

  const citasFiltradas = citasDoctor.filter(cita => 
    filtro === '' || 
    cita.nombrePaciente.toLowerCase().includes(filtro.toLowerCase()) ||
    cita.comentarios?.toLowerCase().includes(filtro.toLowerCase())
  );

  const citasCalificadas = citasFiltradas.filter(cita => cita.calificacion > 0);

  const citasCompletadas = citasDoctor.filter(cita => cita.estadoCita === 3);
 
  const porcentajeCitasCalificadas = citasDoctor.length > 0 
    ? (citasCalificadas.length / citasCompletadas.length) * 100 
    : 0;

  if (loadingDoctores) {
    return (
      <div className="container py-4">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos de doctores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Calificaciones de Doctores</h3>
              <button 
                type="button" 
                className="btn btn-light"
                onClick={() => navigate('/Administrador')}
              >
                Volver
              </button>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              {/* Selector de Doctor */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="doctorSelect" className="form-label">Seleccionar Doctor:</label>
                  <select 
                    id="doctorSelect" 
                    className="form-select"
                    value={selectedDoctor?.idDoctor || ''}
                    onChange={(e) => {
                      const doctorId = Number(e.target.value);
                      const doctor = doctores.find(d => d.idDoctor === doctorId) || null;
                      setSelectedDoctor(doctor);
                    }}
                  >
                    {doctores.map(doctor => (
                      <option key={doctor.idDoctor} value={doctor.idDoctor}>
                        {doctor.nombreCompleto} - {doctor.especialidad} ({doctor.areaNombre})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="mt-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por paciente o comentario..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Información del Doctor */}
              {selectedDoctor && (
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <h4>{selectedDoctor.nombreCompleto}</h4>
                            <p className="mb-1"><strong>Especialidad:</strong> {selectedDoctor.especialidad}</p>
                            <p className="mb-1"><strong>Área:</strong> {selectedDoctor.areaNombre}</p>
                            <p className="mb-1"><strong>Licencia Médica:</strong> {selectedDoctor.licenciaMedica}</p>
                            <p className="mb-1"><strong>Contacto:</strong> {selectedDoctor.correo} | {selectedDoctor.telefono}</p>
                            <p className="mb-0"><strong>Ubicación:</strong> {selectedDoctor.ciudad}, {selectedDoctor.estado}</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <div className="card h-100">
                              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <h2 className="display-4 mb-0">{calcularPromedioCalificacion().toFixed(1)}</h2>
                                <div className="my-2">
                                  {renderizarEstrellas(Math.round(calcularPromedioCalificacion()))}
                                </div>
                                <p className="mb-0">Basado en {citasCalificadas.length} calificaciones</p>
                                <p className="text-muted small">
                                  {porcentajeCitasCalificadas.toFixed(0)}% de citas completadas fueron calificadas
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de Calificaciones */}
              <div className="row">
                <div className="col-md-12">
                  <h5 className="mb-3">Historial de Calificaciones</h5>
                  
                  {loadingCitas ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2">Cargando calificaciones...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>ID Cita</th>
                            <th>Fecha</th>
                            <th>Paciente</th>
                            <th>Calificación</th>
                            <th>Comentarios</th>
                            <th>Fecha Calificación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {citasCalificadas.length > 0 ? (
                            citasCalificadas.map((cita) => (
                              <tr key={cita.idCita}>
                                <td>{cita.idCita}</td>
                                <td>{formatearFechaHora(cita.fechaHora)}</td>
                                <td>{cita.nombrePaciente}</td>
                                <td>
                                  {renderizarEstrellas(cita.calificacion)}
                                </td>
                                <td>
                                  {cita.comentarios || <span className="text-muted">Sin comentarios</span>}
                                </td>
                                <td>
                                  {formatearFechaHora(cita.fechaCalificacion)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                {filtro ? (
                                  <div>
                                    <p className="mb-1">No se encontraron calificaciones con los criterios de búsqueda.</p>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() => setFiltro('')}
                                    >
                                      Limpiar filtro
                                    </button>
                                  </div>
                                ) : (
                                  <p className="mb-0">
                                    {citasDoctor.length > 0 
                                      ? 'Este doctor no tiene citas calificadas aún.' 
                                      : 'Este doctor no tiene citas registradas.'}
                                  </p>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {citasCalificadas.length > 0 && (
                    <div className="mt-3">
                      <p className="text-muted">
                        Mostrando {citasCalificadas.length} de {citasDoctor.filter(c => c.calificacion > 0).length} calificaciones
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen Estadístico */}
              {selectedDoctor && citasDoctor.length > 0 && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h5 className="card-title">Resumen de Actividad</h5>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="card text-center mb-3">
                              <div className="card-body">
                                <h3>{citasDoctor.length}</h3>
                                <p className="mb-0">Total de Citas</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center mb-3">
                              <div className="card-body">
                                <h3>{citasCompletadas.length}</h3>
                                <p className="mb-0">Citas Completadas</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center mb-3">
                              <div className="card-body">
                                <h3>{citasCalificadas.length}</h3>
                                <p className="mb-0">Citas Calificadas</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center mb-3">
                              <div className="card-body">
                                <h3>{porcentajeCitasCalificadas.toFixed(0)}%</h3>
                                <p className="mb-0">Tasa de Calificación</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificacionesDoctores;