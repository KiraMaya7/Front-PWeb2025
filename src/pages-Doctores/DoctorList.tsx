
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Doctor {
  idDoctor: number;
  nombre: string;
  apellidos: string;
  especialidad: string;
  areaNombre: string;
}

export const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/Doctores')
      .then(response => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Listado de Doctores</h2>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.idDoctor}>
            {doctor.nombre} {doctor.apellidos} - {doctor.especialidad} ({doctor.areaNombre})
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DoctorList;