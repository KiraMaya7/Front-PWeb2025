import { Routes, Route } from 'react-router-dom';
import Home from '../pages-Usuarios/Home';
import AreasMedicas from '../pages-Usuarios/AreasMedicas';
import Doctores from '../pages-Usuarios/Doctores';
import Registro from '../pages-Usuarios/Registro';
import Contact from '../pages-Usuarios/Contacto';
import CitasPacientes from '../pages-Doctores/citasPacientes';
import AdminInicio from '../pages-Admin/adminInicio';
import LoginUsuario from '../pages-Usuarios/Profile';
// Páginas privadas
import PrivateRoute from './PrivateRoute';
import AltaMedico from '../pages-Admin/altaMedico';
import ReportesCitas from '../pages-Admin/reportesCitas';
import CalificacionesDoctores from '../pages-Admin/calificacionDoctores';


export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AreasMedicas" element={<AreasMedicas />} />
      <Route path="/Doctores" element={<Doctores />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/profile" element={<LoginUsuario />} />
      <Route path="/Registro" element={<Registro />} />
      
      {/* Ruta para doctores (rol 2) */}
      <Route path="/Doctor" element={
        <PrivateRoute allowedRoles={[2]}>
          <CitasPacientes />
        </PrivateRoute>
      } />
      
      {/* Ruta  para administradores (rol 1) */}
      <Route path="/Administrador" element={
        <PrivateRoute allowedRoles={[1]}>
          <AdminInicio />
        </PrivateRoute>
      } />
        <Route path="/Administrador/altaMedico" element={
        <PrivateRoute allowedRoles={[1]}>
          <AltaMedico />
          </PrivateRoute>
        } />
          <Route path="/Administrador/reportesCitas" element={
        <PrivateRoute allowedRoles={[1]}>
          <ReportesCitas />
          </PrivateRoute>
        } />
        <Route path="/Administrador/calificacionDoctores" element={
        <PrivateRoute allowedRoles={[1]}>
          <CalificacionesDoctores />
          </PrivateRoute>
        } />

    </Routes>
  );
}
