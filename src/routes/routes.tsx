// src/routers/router.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages-Usuarios/Home';
import AreasMedicas from '../pages-Usuarios/AreasMedicas';
import Doctores from '../pages-Usuarios/Doctores';
import Contact from '../pages-Usuarios/Contacto';
import Registro from '../pages-Usuarios/Registro';
import CitasPacientes from '../pages-Doctores/citasPacientes';
import AdminInicio from '../pages-Admin/adminInicio';
import LoginUsuario from '../pages-Usuarios/Profile';
export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta raíz ahora va a Home */}
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AreasMedicas" element={<AreasMedicas />} />
      <Route path="/Doctores" element={<Doctores />} />
      <Route path="/contacto" element={<Contact />} />

      <Route path="/profile" element={<LoginUsuario />} />
      <Route path="/Registro" element={<Registro />} />
      
      {/* Rutas para doctores */}
      <Route path="/Doctor" element={<CitasPacientes />} />
      
      {/* Rutas para administradores */}
      <Route path="/Administrador" element={<AdminInicio />} />
    </Routes>
  );
}