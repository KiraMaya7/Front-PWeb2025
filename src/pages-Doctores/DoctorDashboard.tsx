// src/pages-Usuarios/PacienteDashboard.jsx
import { Link, Routes, Route } from 'react-router-dom';
import AreasMedicas from '../pages-Usuarios/AreasMedicas';
import Doctores from '../pages-Usuarios/Doctores';

export default function DoctorDashboard() {
  return (
    <div>
      <h2>Panel del Doctores</h2>
      <nav>
        <Link to="areas">Áreas Médicas</Link> |{' '}
        <Link to="doctores">Doctores</Link> |{' '}
      </nav>

      <Routes>
        <Route path="areas" element={<AreasMedicas />} />
        <Route path="doctores" element={<Doctores />} />
      </Routes>
    </div>
  );
}
