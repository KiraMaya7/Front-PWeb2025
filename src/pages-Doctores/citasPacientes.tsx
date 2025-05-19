import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Cita {
  idCita: number;
  fechaHora: string;
  nombrePaciente: string;
  estadoNombre: string;
  notas: string;
}

const citasPacientes: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const idUsuario = localStorage.getItem('idUsuario');

  api.get(`/Doctores/Usuario/${idUsuario}`)
    .then(doctorResponse => {
      const idDoctor = doctorResponse.data.idDoctor;
      localStorage.setItem('idDoctor', idDoctor.toString());

      return api.get(`/Citas/Doctor/${idDoctor}`);
    })
    .then(citasResponse => {
      setCitas(citasResponse.data);
    })
    .catch(error => {
      console.error('Error:', error);
      if (idUsuario) {
        api.get(`/Citas/Doctor/${idUsuario}`)
          .then(response => setCitas(response.data))
          .catch(e => console.error('Error secundario:', e))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    })
    .finally(() => {
      if (idUsuario) setLoading(false);
    });
}, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Panel de Doctor</h1>
      
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Citas Programadas</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : citas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Paciente</th>
                    <th>Estado</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(cita => (
                    <tr key={cita.idCita}>
                      <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                      <td>{cita.nombrePaciente}</td>
                      <td>
                        <span className={`badge ${cita.estadoNombre === 'Completada' ? 'bg-success' : 'bg-primary'}`}>
                          {cita.estadoNombre}
                        </span>
                      </td>
                      <td>{cita.notas}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">Ver Detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No hay citas programadas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default citasPacientes;