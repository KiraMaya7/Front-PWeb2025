import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
}

interface Area {
  idArea: number;
  nombre: string;
}

const AltaMedico: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idUsuario: 0,
    licenciaMedica: '',
    idArea: 0,
    especialidad: ''
  });
  const [newUserData, setNewUserData] = useState({
    nombre: '',
    apellidos: '',
    edad: 0,
    telefono: '',
    direccion: '',
    estado: '',
    ciudad: '',
    correo: '',
    usuario: '',
    contraseña: '',
    rol: 2
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosResponse = await api.get('/Cuenta/rol/2');
        setUsuarios(usuariosResponse.data);

        const areasResponse = await api.get('/Doctores/Areas');
        setAreas(areasResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos necesarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idUsuario' || name === 'idArea' ? parseInt(value) : value
    });
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData({
      ...newUserData,
      [name]: name === 'edad' ? parseInt(value) : value
    });
  };

  const toggleUserMode = () => {
    setIsNewUser(!isNewUser);
    setError('');
  };

  const validateNewUserData = () => {
    if (!newUserData.nombre.trim()) return 'El nombre es obligatorio';
    if (!newUserData.apellidos.trim()) return 'Los apellidos son obligatorios';
    if (newUserData.edad <= 0) return 'La edad debe ser mayor a 0';
    if (!newUserData.telefono.trim()) return 'El teléfono es obligatorio';
    if (!newUserData.direccion.trim()) return 'La dirección es obligatoria';
    if (!newUserData.estado.trim()) return 'El estado es obligatorio';
    if (!newUserData.ciudad.trim()) return 'La ciudad es obligatoria';
    if (!newUserData.correo.trim()) return 'El correo es obligatorio';
    if (!newUserData.usuario.trim()) return 'El nombre de usuario es obligatorio';
    if (!newUserData.contraseña.trim()) return 'La contraseña es obligatoria';
    return null;
  };

  const validateDoctorData = () => {
    if (!isNewUser && formData.idUsuario === 0) return 'Debes seleccionar un usuario';
    if (!formData.licenciaMedica.trim()) return 'La licencia médica es obligatoria';
    if (formData.idArea === 0) return 'Debes seleccionar un área médica';
    if (!formData.especialidad.trim()) return 'La especialidad es obligatoria';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isNewUser) {
      const userError = validateNewUserData();
      if (userError) {
        setError(userError);
        return;
      }
    }

    const doctorError = validateDoctorData();
    if (doctorError) {
      setError(doctorError);
      return;
    }

    try {
      let userId = formData.idUsuario;

      if (isNewUser) {
        const userResponse = await api.post('/Cuenta', newUserData);
        if (userResponse.status === 201) {
          if (userResponse.data && userResponse.data.id) {
            userId = userResponse.data.id;
            console.log("Usuario creado con ID:", userId);
          } else {
            console.error("La API no devolvió un ID de usuario como se esperaba:", userResponse.data);
            setError('Error al obtener el ID del usuario creado');
            return;
          }
        } else {
          setError('Error al crear el usuario');
          return;
        }
      }

      const doctorData: any = {
        licenciaMedica: formData.licenciaMedica,
        idArea: formData.idArea,
        especialidad: formData.especialidad
      };
      
      if (userId > 0) {
        doctorData.idUsuario = userId;
      }

      const doctorResponse = await api.post('/Admin/Doctores', doctorData);
      
      if (doctorResponse.status === 201) {
        setSuccess('Doctor registrado exitosamente');
        setFormData({
          idUsuario: 0,
          licenciaMedica: '',
          idArea: 0,
          especialidad: ''
        });
        setNewUserData({
          nombre: '',
          apellidos: '',
          edad: 0,
          telefono: '',
          direccion: '',
          estado: '',
          ciudad: '',
          correo: '',
          usuario: '',
          contraseña: '',
          rol: 2
        });
        setTimeout(() => {
          navigate('/Administrador');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error al registrar doctor:', err);
      setError(err.response?.data?.message || 'Error al registrar doctor');
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Registrar Nuevo Doctor</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <div className="mb-4">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userType"
                    id="existingUser"
                    checked={!isNewUser}
                    onChange={toggleUserMode}
                  />
                  <label className="form-check-label" htmlFor="existingUser">
                    Usuario Existente
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userType"
                    id="newUser"
                    checked={isNewUser}
                    onChange={toggleUserMode}
                  />
                  <label className="form-check-label" htmlFor="newUser">
                    Nuevo Usuario
                  </label>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {!isNewUser ? (
                  <div className="mb-3">
                    <label htmlFor="idUsuario" className="form-label">Usuario</label>
                    <select 
                      id="idUsuario" 
                      name="idUsuario" 
                      className="form-select"
                      value={formData.idUsuario}
                      onChange={handleChange}
                      required
                    >
                      <option value={0}>Selecciona un usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.idUsuario} value={usuario.idUsuario}>
                          {usuario.nombre} {usuario.apellidos}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="new-user-form border p-3 mb-4 rounded">
                    <h4 className="mb-3">Información del Nuevo Usuario</h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="nombre" 
                          name="nombre"
                          value={newUserData.nombre}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="apellidos" className="form-label">Apellidos</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="apellidos" 
                          name="apellidos"
                          value={newUserData.apellidos}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="edad" className="form-label">Edad</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="edad" 
                          name="edad"
                          value={newUserData.edad}
                          onChange={handleNewUserChange}
                          required
                          min="1"
                        />
                      </div>
                      <div className="col-md-8 mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          id="telefono" 
                          name="telefono"
                          value={newUserData.telefono}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="direccion" 
                        name="direccion"
                        value={newUserData.direccion}
                        onChange={handleNewUserChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="estado" className="form-label">Estado</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="estado" 
                          name="estado"
                          value={newUserData.estado}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="ciudad" className="form-label">Ciudad</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="ciudad" 
                          name="ciudad"
                          value={newUserData.ciudad}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="correo" 
                        name="correo"
                        value={newUserData.correo}
                        onChange={handleNewUserChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="usuario" className="form-label">Nombre de Usuario</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="usuario" 
                          name="usuario"
                          value={newUserData.usuario}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="contraseña" className="form-label">Contraseña</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          id="contraseña" 
                          name="contraseña"
                          value={newUserData.contraseña}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <h4 className="mb-3">Información Médica</h4>

                <div className="mb-3">
                  <label htmlFor="licenciaMedica" className="form-label">Licencia Médica</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="licenciaMedica" 
                    name="licenciaMedica"
                    value={formData.licenciaMedica}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="idArea" className="form-label">Área Médica</label>
                  <select 
                    id="idArea" 
                    name="idArea" 
                    className="form-select"
                    value={formData.idArea}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>Selecciona un área</option>
                    {areas.map(area => (
                      <option key={area.idArea} value={area.idArea}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="especialidad" className="form-label">Especialidad</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="especialidad" 
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/Administrador')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">Registrar Doctor</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltaMedico;