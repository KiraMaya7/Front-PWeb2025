import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Cita {
  idCita: number;
  idDoctor: number;
  fechaHora: string;
  estadoCita: number;
  medico: string;
  especialidad: string;
}

interface Doctor {
  idDoctor: number;
  nombre: string;
  especialidad: string;
}

const InicioPaciente: React.FC = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fechaHora: '',
    idDoctor: 0,
    motivo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const idUsuario = Number(localStorage.getItem('idUsuario'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citasResponse, doctoresResponse] = await Promise.all([
          api.get(`/Citas/Paciente/${idUsuario}`),
          api.get('/Doctores')
        ]);

        const citasCompletas = citasResponse.data.map((cita: any) => {
          const doctor = doctoresResponse.data.find(
            (d: Doctor) => d.idDoctor === cita.idDoctor
          );
          
          return {
            ...cita,
            medico: doctor ? doctor.nombre : 'Médico no disponible',
            especialidad: doctor?.especialidad || ''
          };
        });

        setCitas(citasCompletas);
        setDoctores(doctoresResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idDoctor' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fechaHora) return setError('Seleccione fecha y hora');
    if (formData.idDoctor === 0) return setError('Seleccione un médico');
    if (!formData.motivo.trim()) return setError('El motivo es requerido');

    try {
      const citaData = {
        idDoctor: formData.idDoctor,
        idUsuario: idUsuario,
        fechaHora: new Date(formData.fechaHora).toISOString(),
        estadoCita: 1, // Estado inicial: Pendiente
        notas: formData.motivo
      };

      const response = await api.post('/citas', citaData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 201) {
        setSuccess('Cita agendada exitosamente!');
        
        // Actualizar lista de citas
        const citasResponse = await api.get(`/Citas/Paciente/${idUsuario}`);
        const doctoresResponse = await api.get('/Doctores');
        
        const citasActualizadas = citasResponse.data.map((cita: any) => {
          const doctor = doctoresResponse.data.find(
            (d: Doctor) => d.idDoctor === cita.idDoctor
          );
          
          return {
            ...cita,
            medico: doctor ? doctor.nombre : 'Médico no disponible',
            especialidad: doctor?.especialidad || ''
          };
        });
        
        setCitas(citasActualizadas);
        setFormData({ fechaHora: '', idDoctor: 0, motivo: '' });
      }
    } catch (err: any) {
      console.error('Error al agendar cita:', err);
      setError(err.response?.data?.message || 'Error al agendar cita');
    }
  };

  const handleUpdateStatus = async (idCita: number, nuevoEstado: number) => {
    const confirmar = window.confirm(
      nuevoEstado === 2 
        ? '¿Confirmar esta cita?' 
        : '¿Cancelar esta cita?'
    );
    
    if (!confirmar) return;

    try {
      await api.patch(`/Citas/${idCita}/Estado/${nuevoEstado}`, null, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualización del estado, quitando las canceladas
      const nuevasCitas = citas
        .map(c => 
          c.idCita === idCita ? { ...c, estadoCita: nuevoEstado } : c
        )
        .filter(c => c.estadoCita !== 3); // Ocultar canceladas

      setCitas(nuevasCitas);
      
      setSuccess(
        nuevoEstado === 2 
          ? 'Cita confirmada correctamente' 
          : 'Cita cancelada correctamente'
      );
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al actualizar cita');
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8">
          <h3 className="mb-4">Mis Citas Programadas</h3>
          {citas.filter(c => c.estadoCita !== 3).length === 0 ? (
            <div className="alert alert-info">No tienes citas programadas</div>
          ) : (
            <div className="list-group">
              {citas
                .filter(c => c.estadoCita !== 3)
                .map(cita => (
                <div key={cita.idCita} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-2">
                        {new Date(cita.fechaHora).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </h5>
                      <p className="mb-1 fw-bold">{cita.medico}</p>
                      <p className="text-muted small mb-1">{cita.especialidad}</p>
                    </div>
                    <div className="text-end">
                      <span className={`badge mb-2 ${
                        cita.estadoCita === 2 ? 'bg-success' : 
                        cita.estadoCita === 1 ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {cita.estadoCita === 2 ? 'Confirmada' : 
                         cita.estadoCita === 1 ? 'Pendiente' : 'Cancelada'}
                      </span>
                      <br />
                      {cita.estadoCita === 1 && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleUpdateStatus(cita.idCita, 2)}
                          >
                            Confirmar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleUpdateStatus(cita.idCita, 3)} 
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Agendar Nueva Cita</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fechaHora" className="form-label">Fecha y Hora</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="fechaHora"
                    name="fechaHora"
                    value={formData.fechaHora}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="idDoctor" className="form-label">Seleccionar Médico</label>
                  <select
                    id="idDoctor"
                    name="idDoctor"
                    className="form-select"
                    value={formData.idDoctor}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>-- Seleccione un médico --</option>
                    {doctores.map(doctor => (
                      <option key={doctor.idDoctor} value={doctor.idDoctor}>
                        {doctor.nombre} - {doctor.especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="motivo" className="form-label">Motivo de la consulta</label>
                  <textarea
                    className="form-control"
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describa el motivo de su consulta..."
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Agendar Cita
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => navigate('/paciente')}
                  >
                    Volver al Inicio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioPaciente;
