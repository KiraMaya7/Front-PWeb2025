import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Registro = () => {
  const [form, setForm] = useState({
    contraseña: '',
    nombre: '',
    apellidos: '',
    edad: "",
    telefono: '',
    direccion: '',
    estado: '',
    ciudad: '',
    correo: '',
    usuario: '',
    rol: 3 
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {Object.entries(form).map(([key, value]) =>
          key !== 'rol' ? (
            <div key={key} className="mb-3">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                className="form-control"
                type={typeof value === 'number' ? 'number' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          ) : null
        )}
        <button className="btn btn-success" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;

