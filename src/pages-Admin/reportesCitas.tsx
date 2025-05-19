import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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

const ReportesCitas: React.FC = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<number | null>(null);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/Citas');
        setCitas(response.data);
      } catch (err) {
        console.error('Error al cargar las citas:', err);
        setError('No se pudieron cargar las citas. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  // Función para formatear fecha y hora
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

  // Función para obtener el color según el estado de la cita
  const obtenerColorEstado = (estadoCita: number) => {
    switch (estadoCita) {
      case 0: return 'bg-warning text-dark'; // Pendiente
      case 1: return 'bg-success text-white'; // Confirmada
      case 2: return 'bg-danger text-white'; // Cancelada
      case 3: return 'bg-info text-white'; // Completada
      default: return 'bg-secondary text-white';
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estadoNombre: string) => {
    return estadoNombre || 'Desconocido';
  };

  // Filtrar citas según criterio de búsqueda
  const citasFiltradas = citas.filter(cita => {
    // Filtrar por búsqueda (nombre de doctor, paciente o especialidad)
    const cumpleFiltroTexto = filtro === '' || 
      cita.nombreDoctor.toLowerCase().includes(filtro.toLowerCase()) ||
      cita.nombrePaciente.toLowerCase().includes(filtro.toLowerCase()) ||
      cita.especialidadDoctor.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtrar por estado
    const cumpleFiltroEstado = estadoFiltro === null || cita.estadoCita === estadoFiltro;
    
    return cumpleFiltroTexto && cumpleFiltroEstado;
  });

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos de citas...</p>
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
              <h3 className="mb-0">Reporte de Citas</h3>
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
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por doctor, paciente o especialidad..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setFiltro('')}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={estadoFiltro === null ? '' : estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">Todos los estados</option>
                    <option value="0">Pendiente</option>
                    <option value="1">Confirmada</option>
                    <option value="2">Cancelada</option>
                    <option value="3">Completada</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Fecha y Hora</th>
                      <th>Paciente</th>
                      <th>Doctor</th>
                      <th>Especialidad</th>
                      <th>Estado</th>
                      <th>Calificación</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasFiltradas.length > 0 ? (
                      citasFiltradas.map((cita) => (
                        <tr key={cita.idCita}>
                          <td>{cita.idCita}</td>
                          <td>{formatearFechaHora(cita.fechaHora)}</td>
                          <td>{cita.nombrePaciente}</td>
                          <td>{cita.nombreDoctor}</td>
                          <td>{cita.especialidadDoctor}</td>
                          <td>
                            <span className={`badge ${obtenerColorEstado(cita.estadoCita)}`}>
                              {obtenerTextoEstado(cita.estadoNombre)}
                            </span>
                          </td>
                          <td>
                            {cita.calificacion > 0 ? (
                              <div className="d-flex align-items-center">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`bi ${i < cita.calificacion ? 'bi-star-fill' : 'bi-star'} text-warning`}
                                  ></i>
                                ))}
                                <span className="ms-1">({cita.calificacion})</span>
                              </div>
                            ) : (
                              <span className="text-muted">Sin calificar</span>
                            )}
                          </td>
                          <td>
                            {cita.notas ? (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-info" 
                                data-bs-toggle="popover" 
                                data-bs-trigger="focus" 
                                title="Notas" 
                                data-bs-content={cita.notas}
                              >
                                Ver notas
                              </button>
                            ) : (
                              <span className="text-muted">Sin notas</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => navigate(`/detalle-cita/${cita.idCita}`)}
                              >
                                Detalles
                              </button>
                              {cita.estadoCita === 0 && (
                                <>
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-success"
                                    // onClick para confirmar cita
                                  >
                                    Confirmar
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-danger"
                                    // onClick para cancelar cita
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          {filtro || estadoFiltro !== null ? (
                            <div>
                              <p className="mb-1">No se encontraron citas con los criterios de búsqueda.</p>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  setFiltro('');
                                  setEstadoFiltro(null);
                                }}
                              >
                                Limpiar filtros
                              </button>
                            </div>
                          ) : (
                            <p className="mb-0">No hay citas registradas en el sistema.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {citas.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted">Mostrando {citasFiltradas.length} de {citas.length} citas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportesCitas;