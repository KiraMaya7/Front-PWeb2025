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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios con rol 2 (doctores sin asignar)
        const usuariosResponse = await api.get('/Cuenta/rol/2');
        setUsuarios(usuariosResponse.data);

        // Obtener áreas médicas
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.idUsuario === 0) {
      setError('Debes seleccionar un usuario');
      return;
    }

    if (!formData.licenciaMedica.trim()) {
      setError('La licencia médica es obligatoria');
      return;
    }

    if (formData.idArea === 0) {
      setError('Debes seleccionar un área médica');
      return;
    }

    if (!formData.especialidad.trim()) {
      setError('La especialidad es obligatoria');
      return;
    }

    try {
      const response = await api.post('/Admin/Doctores', formData);
      
      if (response.status === 201) {
        setSuccess('Doctor registrado exitosamente');
        setFormData({
          idUsuario: 0,
          licenciaMedica: '',
          idArea: 0,
          especialidad: ''
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
              
              <form onSubmit={handleSubmit}>
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