// src/routers/router.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages-Usuarios/Home';
import AreasMedicas from '../pages-Usuarios/AreasMedicas';
//import Services from '../pages-Usuarios/Services';
import Doctores from '../pages-Usuarios/Doctores';
import Contact from '../pages-Usuarios/Contacto';
import Profile from '../pages-Usuarios/Profile';
import DoctorList from '../pages-Doctores/DoctorList';
import Registro from '../pages-Usuarios/Registro';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AreasMedicas" element={<AreasMedicas />} />
      <Route path="/Doctores" element={<Doctores />} />
      <Route path="/Doctores" element={<Doctores />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Registro" element={<Registro />} />
    </Routes>
  );
}
