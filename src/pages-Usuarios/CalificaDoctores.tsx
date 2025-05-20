import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Cita {
  idCita: number;
  fechaHora: string;
  idEstado: number;
  idDoctor: number;
  nombreDoctor: string;
  especialidadDoctor: string;
  estado: string;
}

interface RatedCita {
  calificacion: number;
  comentario: string;
}

const CalificacionesPacientes = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratedCitas, setRatedCitas] = useState<{ [key: number]: RatedCita }>(() => {
    const stored = localStorage.getItem('ratedCitas');
    return stored ? JSON.parse(stored) : {};
  });

  const idUsuario = Number(localStorage.getItem('idUsuario'));

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/Citas/Paciente/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const citasMapeadas = response.data.map((cita: any) => ({
          idCita: cita.idCita,
          fechaHora: cita.fechaHora,
          idEstado: cita.estadoCita || cita.idEstado,
          idDoctor: cita.idDoctor,
          nombreDoctor: cita.idDoctorNavigation?.idUsuarioNavigation?.nombre 
            || cita.nombreDoctor 
            || 'Dr. Sin nombre',
          especialidadDoctor: cita.idDoctorNavigation?.especialidad 
            || cita.especialidad 
            || 'General',
          estado: cita.idEstado === 4 ? 'Completada' : 'Confirmada'
        }));

        // Filtrar solo citas completadas para el 4 noams
        const citasFiltradas = citasMapeadas.filter((cita: Cita) => 
          cita.idEstado === 4
        );

        setCitas(citasFiltradas);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error cargando citas. Intenta nuevamente más tarde.');
        setLoading(false);
      }
    };
    cargarCitas();
  }, [idUsuario, navigate]);

  const enviarCalificacion = async (idCita: number, calificacion: number, comentario: string) => {
    if (calificacion === 0) {
      setError('Debes asignar una calificación');
      return;
    }

    try {
      await api.patch(`/Citas/${idCita}/Calificar`, {
        calificacion,
        comentarios: comentario || "Sin comentarios"
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Actualizar citasc
      const newRatedCitas = {
        ...ratedCitas,
        [idCita]: { calificacion, comentario: comentario || "Sin comentarios" }
      };
      localStorage.setItem('ratedCitas', JSON.stringify(newRatedCitas));
      setRatedCitas(newRatedCitas);

      //impiar los estados del formulario
      setCalificaciones(prev => {
        const newCalificaciones = {...prev};
        delete newCalificaciones[idCita];
        return newCalificaciones;
      });
      
      setComentarios(prev => {
        const newComentarios = {...prev};
        delete newComentarios[idCita];
        return newComentarios;
      });

      alert('¡Calificación enviada exitosamente!');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al enviar calificación');
    }
  };

  if (loading) return <div className="text-center my-4"><div className="spinner-border text-primary"/></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Citas Completadas</h2>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        Volver
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {citas.length === 0 ? (
        <div className="alert alert-info">
          No hay citas completadas para calificar.
        </div>
      ) : (
        <div className="row">
          {citas.map((cita) => {
            const calificacionExistente = ratedCitas[cita.idCita];
            return (
              <div key={cita.idCita} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title">
                          {new Date(cita.fechaHora).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </h5>
                        <p className="card-text">
                          <strong>Doctor:</strong> {cita.nombreDoctor}<br/>
                          <strong>Especialidad:</strong> {cita.especialidadDoctor}
                        </p>
                      </div>
                    </div>

                    {calificacionExistente ? (
                      <div className="mt-3">
                        <p className="text-success">
                          <strong>Calificación:</strong> 
                          {Array(calificacionExistente.calificacion).fill('★').join('')}
                        </p>
                        <p><strong>Comentario:</strong> {calificacionExistente.comentario}</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        enviarCalificacion(
                          cita.idCita,
                          calificaciones[cita.idCita] || 0,
                          comentarios[cita.idCita] || ''
                        );
                      }} className="mt-3">
                        <div className="mb-3">
                          <label className="form-label">Calificación (1-5 estrellas):</label>
                          <div className="d-flex gap-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                className={`btn btn-lg ${calificaciones[cita.idCita] >= num ? 'btn-warning' : 'btn-outline-secondary'}`}
                                onClick={() => {
                                  setCalificaciones(prev => ({
                                    ...prev,
                                    [cita.idCita]: num
                                  }));
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Comentarios:</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={comentarios[cita.idCita] || ''}
                            onChange={(e) => setComentarios(prev => ({
                              ...prev,
                              [cita.idCita]: e.target.value
                            }))}
                            placeholder="Tu experiencia con el médico..."
                          ></textarea>
                        </div>

                        <button 
                          type="submit" 
                          className="btn btn-success"
                          disabled={!calificaciones[cita.idCita]}
                        >
                          Enviar Calificación
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalificacionesPacientes;

