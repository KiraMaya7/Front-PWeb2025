import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface HistorialMedico {
  historialId?: number;
  idUsuario: number;
  idDoctor: number;
  alergias: string;
  enfermedades: string;
  consumoBebidas: string;
  habitos: string;
  cirugias: string;
  receta: string;
  diagnostico: string;
  nombreDoctor?: string;
  especialidadDoctor?: string;
  nombrePaciente?: string;
}

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
}

const HistorialMedicoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Usuario | null>(null);
  const [historial, setHistorial] = useState<HistorialMedico | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<HistorialMedico>({
    idUsuario: Number(id),
    idDoctor: Number(localStorage.getItem('idDoctor')) || 0,
    alergias: '',
    enfermedades: '',
    consumoBebidas: '',
    habitos: '',
    cirugias: '',
    receta: '',
    diagnostico: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasHistorial, setHasHistorial] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const pacienteResponse = await api.get(`/Cuenta/${id}`);
      setPaciente({
        idUsuario: pacienteResponse.data.idUsuario,
        nombre: pacienteResponse.data.nombre,
        apellidos: pacienteResponse.data.apellidos
      });

      try {
        const historialResponse = await api.get(`/HistorialMedico/Paciente/${id}`);

        if (Array.isArray(historialResponse.data) && historialResponse.data.length > 0) {
          const historialData = historialResponse.data[0];
          setHistorial(historialData);
          setFormData(historialData);
          setHasHistorial(true);
          console.log("Medical history found:", historialData);
        } else if (!Array.isArray(historialResponse.data)) {
          setHistorial(historialResponse.data);
          setFormData(historialResponse.data);
          setHasHistorial(true);
          console.log("Medical history found:", historialResponse.data);
        } else {
          throw new Error("No medical history found");
        }
      } catch (historialError) {
        console.log('No se encontró historial médico para este paciente, se creará uno nuevo', historialError);
        setHasHistorial(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar datos del paciente');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const dataToSubmit = {
        ...formData,
        idUsuario: Number(id),
        idDoctor: Number(localStorage.getItem('idDoctor')) || 0
      };

      if (hasHistorial) {
        await api.put(`/HistorialMedico/${historial?.historialId}`, dataToSubmit);
        setSuccess('Historial médico actualizado correctamente');
      } else {
        const response = await api.post('/HistorialMedico', dataToSubmit);
        setHistorial(response.data);
        setHasHistorial(true);
        setSuccess('Historial médico creado correctamente');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar historial médico:', error);
      setError('Error al guardar los cambios. Por favor, inténtelo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Historial Médico</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Patient Information Card */}
      {paciente && (
        <div className="card mb-4">
          <div className="card-body bg-light">
            <h3 className="card-title">{paciente.nombre} {paciente.apellidos}</h3>
            <p className="card-text text-muted">ID: {paciente.idUsuario}</p>
          </div>
        </div>
      )}

      {/* Medical History Form */}
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {hasHistorial ? 'Datos del Historial Médico' : 'Crear Nuevo Historial Médico'}
          </h5>
          {hasHistorial && !isEditing && (
            <button 
              className="btn btn-light btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="alergias" className="form-label">Alergias</label>
                <textarea
                  className="form-control"
                  id="alergias"
                  name="alergias"
                  rows={3}
                  value={formData.alergias}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ingrese las alergias del paciente"
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="enfermedades" className="form-label">Enfermedades</label>
                <textarea
                  className="form-control"
                  id="enfermedades"
                  name="enfermedades"
                  rows={3}
                  value={formData.enfermedades}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ingrese las enfermedades del paciente"
                ></textarea>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="consumoBebidas" className="form-label">Consumo de Bebidas</label>
                <textarea
                  className="form-control"
                  id="consumoBebidas"
                  name="consumoBebidas"
                  rows={3}
                  value={formData.consumoBebidas}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Describa el consumo de bebidas"
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="habitos" className="form-label">Hábitos</label>
                <textarea
                  className="form-control"
                  id="habitos"
                  name="habitos"
                  rows={3}
                  value={formData.habitos}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Describa los hábitos del paciente"
                ></textarea>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="cirugias" className="form-label">Cirugías</label>
                <textarea
                  className="form-control"
                  id="cirugias"
                  name="cirugias"
                  rows={3}
                  value={formData.cirugias}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ingrese las cirugías previas"
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="diagnostico" className="form-label">Diagnóstico</label>
                <textarea
                  className="form-control"
                  id="diagnostico"
                  name="diagnostico"
                  rows={3}
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ingrese el diagnóstico actual"
                ></textarea>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="receta" className="form-label">Receta</label>
              <textarea
                className="form-control"
                id="receta"
                name="receta"
                rows={4}
                value={formData.receta}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Ingrese la receta médica"
              ></textarea>
            </div>

            {isEditing && (
              <div className="d-flex justify-content-end">
                {hasHistorial && (
                  <button 
                    type="button" 
                    className="btn btn-secondary me-2"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(historial || formData);
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    hasHistorial ? 'Actualizar Historial' : 'Crear Historial'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HistorialMedicoPage;