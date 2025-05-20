import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  edad: number;
  telefono: string;
  direccion: string;
  estado: string;
  ciudad: string;
  correo: string;
  usuario: string;
  contraseña: string;
  rol: number;
}

interface NuevoUsuario {
  nombre: string;
  apellidos: string;
  edad: number | string;
  telefono: string;
  direccion: string;
  estado: string;
  ciudad: string;
  correo: string;
  usuario: string;
  contraseña: string;
  rol: number;
}

const nombresRoles: { [key: number]: string } = {
  1: 'Administrador',
  2: 'Doctor',
  3: 'Paciente',
};

const GestionUsuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtro, setFiltro] = useState('');
  const [filtroRol, setFiltroRol] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Usuario>({
    idUsuario: 0,
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
    rol: 0
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioParaEliminar, setUsuarioParaEliminar] = useState<number | null>(null);
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerFormData, setRegisterFormData] = useState<NuevoUsuario>({
    nombre: '',
    apellidos: '',
    edad: '',
    telefono: '',
    direccion: '',
    estado: '',
    ciudad: '',
    correo: '',
    usuario: '',
    contraseña: '',
    rol: 3 
  });
  const [registerError, setRegisterError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/Cuenta');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('No se pudieron cargar los usuarios. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleFiltroTexto = filtro === '' || 
      usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.usuario.toLowerCase().includes(filtro.toLowerCase());
    const cumpleFiltroRol = filtroRol === null || usuario.rol === filtroRol;
    
    return cumpleFiltroTexto && cumpleFiltroRol;
  });

  const handleOpenEditModal = (usuario: Usuario) => {
    setFormData({...usuario});
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'edad' || name === 'rol' ? parseInt(value, 10) : value
    }));
  };

  const handleUpdateUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioSeleccionado) return;
    
    setError('');
    setSuccess('');
    
    try {
      const response = await api.put(`/Cuenta/${usuarioSeleccionado.idUsuario}`, formData);
      
      if (response.status === 200) {
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(usuario => 
            usuario.idUsuario === usuarioSeleccionado.idUsuario ? formData : usuario
          )
        );
        
        setSuccess('Usuario actualizado correctamente');
        
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleOpenDeleteModal = (idUsuario: number) => {
    setUsuarioParaEliminar(idUsuario);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUsuarioParaEliminar(null);
    setError('');
    setSuccess('');
  };

  const handleDeleteUsuario = async () => {
    if (!usuarioParaEliminar) return;
    
    setError('');
    setSuccess('');
    
    try {
      console.log(`Intentando eliminar usuario con ID: ${usuarioParaEliminar}`);
      
      const response = await api.delete(`/Cuenta/${usuarioParaEliminar}`);
      
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      if (response.status === 200) {
        setUsuarios(prevUsuarios => 
          prevUsuarios.filter(usuario => usuario.idUsuario !== usuarioParaEliminar)
        );
        
        setSuccess('Usuario eliminado correctamente');
        setTimeout(() => {
          handleCloseDeleteModal();
        }, 1500);
      } else {
        setError(`Respuesta inesperada: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      console.log('Error detallado:', err);
      
      if (err.response) {
        console.log('Detalles de respuesta de error:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      
      const errorMessage = 
        err.response?.data?.message || 
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Error al eliminar usuario. Posiblemente existan registros asociados a este usuario.';
        
      setError(errorMessage);
    }
  };

  const handleOpenRegisterModal = () => {
    setRegisterFormData({
      nombre: '',
      apellidos: '',
      edad: '',
      telefono: '',
      direccion: '',
      estado: '',
      ciudad: '',
      correo: '',
      usuario: '',
      contraseña: '',
      rol: 3 
    });
    setRegisterError('');
    setSuccess('');
    setShowRegisterModal(true);
  };
  
  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterError('');
    setSuccess('');
  };
  
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterFormData(prevState => ({
      ...prevState,
      [name]: name === 'edad' || name === 'rol' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setSuccess('');
    
    if (!registerFormData.nombre.trim() || !registerFormData.apellidos.trim() || 
        !registerFormData.correo.trim() || !registerFormData.usuario.trim() || 
        !registerFormData.contraseña.trim()) {
      setRegisterError('Los campos marcados con * son obligatorios');
      return;
    }
    
    try {
      const dataToSend = {
        ...registerFormData,
        edad: typeof registerFormData.edad === 'string' ? 
              (registerFormData.edad === '' ? 0 : parseInt(registerFormData.edad, 10)) : 
              registerFormData.edad
      };
      
      const response = await api.post('/Cuenta', dataToSend);
      
      if (response.status === 201) {
        const updatedUsers = await api.get('/Cuenta');
        setUsuarios(updatedUsers.data);
        
        setSuccess('Usuario registrado exitosamente');
        setTimeout(() => {
          setShowRegisterModal(false);
          setSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error al registrar usuario:', err);
      setRegisterError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Gestión de Usuarios</h3>
              <div>
                <button 
                  type="button" 
                  className="btn btn-success me-2"
                  onClick={handleOpenRegisterModal}
                >
                  Nuevo Usuario
                </button>
                <button 
                  type="button" 
                  className="btn btn-light"
                  onClick={() => navigate('/Administrador')}
                >
                  Volver
                </button>
              </div>
            </div>
            <div className="card-body">
              {error && !showModal && !showDeleteModal && !showRegisterModal && 
                <div className="alert alert-danger">{error}</div>}
              {success && !showModal && !showDeleteModal && !showRegisterModal && 
                <div className="alert alert-success">{success}</div>}
              
              {/* Filtros */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, apellido, correo o usuario..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setFiltro('')}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={filtroRol === null ? '' : filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">Todos los roles</option>
                    <option value="1">Administrador</option>
                    <option value="2">Doctor</option>
                    <option value="3">Paciente</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Usuarios */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Correo</th>
                      <th>Usuario</th>
                      <th>Teléfono</th>
                      <th>Ubicación</th>
                      <th>Edad</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length > 0 ? (
                      usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.idUsuario}>
                          <td>{usuario.idUsuario}</td>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellidos}</td>
                          <td>{usuario.correo}</td>
                          <td>{usuario.usuario}</td>
                          <td>{usuario.telefono}</td>
                          <td>{usuario.ciudad}, {usuario.estado}</td>
                          <td>{usuario.edad}</td>
                          <td>
                            <span className={`badge bg-${getRolBadgeColor(usuario.rol)}`}>
                              {nombresRoles[usuario.rol] || `Rol ${usuario.rol}`}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleOpenEditModal(usuario)}
                              >
                                Editar
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleOpenDeleteModal(usuario.idUsuario)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="text-center py-4">
                          {filtro || filtroRol !== null ? (
                            <div>
                              <p className="mb-1">No se encontraron usuarios con los criterios de búsqueda.</p>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  setFiltro('');
                                  setFiltroRol(null);
                                }}
                              >
                                Limpiar filtros
                              </button>
                            </div>
                          ) : (
                            <p className="mb-0">No hay usuarios registrados en el sistema.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {usuarios.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted">
                    Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Registro de Nuevo Usuario */}
      {showRegisterModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Registrar Nuevo Usuario</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseRegisterModal}></button>
              </div>
              <div className="modal-body">
                {registerError && <div className="alert alert-danger">{registerError}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleRegisterSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-nombre" className="form-label">Nombre *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-nombre" 
                        name="nombre"
                        value={registerFormData.nombre}
                        onChange={handleRegisterInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-apellidos" className="form-label">Apellidos *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-apellidos" 
                        name="apellidos"
                        value={registerFormData.apellidos}
                        onChange={handleRegisterInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-correo" className="form-label">Correo Electrónico *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="register-correo" 
                        name="correo"
                        value={registerFormData.correo}
                        onChange={handleRegisterInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-telefono" className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        id="register-telefono" 
                        name="telefono"
                        value={registerFormData.telefono}
                        onChange={handleRegisterInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="register-direccion" className="form-label">Dirección</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-direccion" 
                        name="direccion"
                        value={registerFormData.direccion}
                        onChange={handleRegisterInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-ciudad" className="form-label">Ciudad</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-ciudad" 
                        name="ciudad"
                        value={registerFormData.ciudad}
                        onChange={handleRegisterInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="register-estado" className="form-label">Estado</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-estado" 
                        name="estado"
                        value={registerFormData.estado}
                        onChange={handleRegisterInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="register-edad" className="form-label">Edad</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="register-edad" 
                        name="edad"
                        min="1"
                        value={registerFormData.edad}
                        onChange={handleRegisterInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="register-usuario" className="form-label">Nombre de Usuario *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="register-usuario" 
                        name="usuario"
                        value={registerFormData.usuario}
                        onChange={handleRegisterInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="register-rol" className="form-label">Rol</label>
                      <select 
                        className="form-select" 
                        id="register-rol" 
                        name="rol"
                        value={registerFormData.rol}
                        onChange={handleRegisterInputChange}
                      >
                        <option value={1}>Administrador</option>
                        <option value={2}>Doctor</option>
                        <option value={3}>Paciente</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="register-contraseña" className="form-label">Contraseña *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="register-contraseña" 
                      name="contraseña"
                      value={registerFormData.contraseña}
                      onChange={handleRegisterInputChange}
                      required
                    />
                    <small className="text-muted">La contraseña debe tener al menos 6 caracteres.</small>
                  </div>
                  
                  <p className="text-muted mb-3">Los campos marcados con * son obligatorios.</p>

                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCloseRegisterModal}>Cancelar</button>
                    <button type="submit" className="btn btn-success">Registrar Usuario</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showModal && usuarioSeleccionado && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Editar Usuario</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleUpdateUsuario}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="nombre" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
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
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="correo" 
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        id="telefono" 
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="direccion" 
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ciudad" className="form-label">Ciudad</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="ciudad" 
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="estado" className="form-label">Estado</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="estado" 
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
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
                        min="1"
                        value={formData.edad}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="usuario" className="form-label">Nombre de Usuario</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="usuario" 
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="rol" className="form-label">Rol</label>
                      <select 
                        className="form-select" 
                        id="rol" 
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={1}>Administrador</option>
                        <option value={2}>Doctor</option>
                        <option value={3}>Paciente</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contraseña" className="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="contraseña" 
                      name="contraseña"
                      value={formData.contraseña}
                      onChange={handleInputChange}
                      placeholder="Dejar en blanco para mantener la actual"
                    />
                    <small className="text-muted">Si no desea cambiar la contraseña, deje este campo en blanco.</small>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <p>¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.</p>
                <p className="mb-0"><strong>Usuario ID:</strong> {usuarioParaEliminar}</p>
                <p><strong>Nombre:</strong> {usuarios.find(u => u.idUsuario === usuarioParaEliminar)?.nombre || ''} {usuarios.find(u => u.idUsuario === usuarioParaEliminar)?.apellidos || ''}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUsuario}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getRolBadgeColor = (rol: number): string => {
  switch (rol) {
    case 1: return 'danger'; 
    case 2: return 'primary'; 
    case 3: return 'success'; 
    case 4: return 'info'; 
    default: return 'secondary';
  }
};

export default GestionUsuarios;