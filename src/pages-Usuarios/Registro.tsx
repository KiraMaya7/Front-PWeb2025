import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Registro = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    edad: "",
    telefono: '',
    direccion: '',
    estado: '',
    ciudad: '',
    correo: '',
    usuario: '',
    contraseña: '',
    rol: 3 
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value.trim() === "" ? null : (name === 'edad' || name === 'rol' ? Number(value) : value)
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellidos || !form.correo || !form.usuario || !form.contraseña) {
      alert("Los campos marcados con * son obligatorios");
      return;
    }
    try {
      await api.post('/Cuenta', form);
      alert('Registro exitoso');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error al registrar');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        {Object.entries(form).map(([key, value]) => {
          if (key === 'rol') {
            return (
              <div key={key} className="mb-3">
                <label>Rol</label>
                <select
                  className="form-control"
                  name="rol"
                  value={value}
                  onChange={handleChange}
                  required
                >
                  <option value={3}>Paciente</option>
                </select>
              </div>
            );
          } else {
            return (
              <div key={key} className="mb-3">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  className="form-control"
                  type={typeof value === 'number' ? 'number' : 'text'}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  required={['nombre', 'apellidos', 'correo', 'usuario', 'contraseña'].includes(key)}
                />
              </div>
            );
          }
        })}
        <button className="btn btn-success" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;


