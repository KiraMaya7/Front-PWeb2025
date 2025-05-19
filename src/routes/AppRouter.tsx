import { Routes, Route } from 'react-router-dom';
import Home from '../pages-Usuarios/Home';
import AreasMedicas from '../pages-Usuarios/AreasMedicas';
import Doctores from '../pages-Usuarios/Doctores';
import Contacto from '../pages-Usuarios/Contacto';
import Profile from '../pages-Usuarios/Profile';
import Registro from '../pages-Usuarios/Registro';
import Login from '../pages-Usuarios/Profile';

// Páginas privadas
import AdminDashboard from '../pages-Admin/altaMedico';
import PacienteDashboard from '../pages-Usuarios/PacienteDashboard';
import PrivateRoute from './PrivateRoute';
import DoctorDashboard from '../pages-Doctores/DoctorDashboard';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AreasMedicas" element={<AreasMedicas />} />
      <Route path="/Doctores" element={<Doctores />} />
      <Route path="/Contacto" element={<Contacto />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/Administrador"
        element={
          <PrivateRoute allowedRoles={[1]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/Doctor"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <DoctorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/Paciente"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <PacienteDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
