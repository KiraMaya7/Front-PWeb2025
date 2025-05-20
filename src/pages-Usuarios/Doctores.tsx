import  { useState, useEffect } from 'react';
import {  Spinner } from 'react-bootstrap';
import api from '../services/api';

interface Doctor {
  idDoctor: number;
  nombre: string;
  licenciaMedica: string;
  especialidad: string;
  imagen?: string;
  descripcion?: string;
}

interface CitaData {
  idDoctor: number;
  idUsuario: number;
  fechaHora: string;
  estadoCita: number;
  notas: string;
}
// Eliminamos modal no utilizado 
const Doctores = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detalleDoctor, setDetalleDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<CitaData>({
    idDoctor: 0,
    idUsuario: Number(localStorage.getItem('idUsuario')),
    fechaHora: '',
    estadoCita: 1,
    notas: ''
  });
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const imagenes = [
    '/DoctorCardio.jpg',
    '/Doctor2.webp',
    '/Doctor3.jpg',
    '/Doctor4.webp',
    '/Doctor5.jpg',
    '/Doctor6.jpg',
  ];

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const response = await api.get('/Doctores');
        setDoctores(response.data);
      } catch (err) {
        setError('Error al cargar los doctores');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctores();
  }, []);

  const handleInformacion = (doctor: Doctor) => {
    setDetalleDoctor(doctor);
  };


  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Nuestros Especialistas</h2>

      {detalleDoctor ? (
        <div className="card mb-5 shadow">
          <div className="row g-0">
            <div className="col-md-4">
              <img 
                src={imagenes[detalleDoctor.idDoctor % imagenes.length]} 
                className="img-fluid rounded-start" 
                alt={detalleDoctor.nombre}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h4 className="card-title">{detalleDoctor.nombre}</h4>
                <h6 className="text-muted">{detalleDoctor.especialidad}</h6>
                <p><strong>Licencia médica:</strong> {detalleDoctor.licenciaMedica}</p>
                <p><strong>Historia:</strong> {detalleDoctor.nombre} es un especialista con más de 10 años de experiencia en su campo. Se graduó con honores y ha trabajado en reconocidos hospitales a nivel nacional e internacional.</p>
                <p><strong>Experiencia:</strong> Ha realizado más de 2,000 consultas exitosas, participa en congresos médicos y es mentor de nuevos residentes en su especialidad.</p>
                <button className="btn btn-danger mt-3" onClick={() => setDetalleDoctor(null)}>
                  Volver al listado
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {doctores.map((doctor, index) => (
            <div key={doctor.idDoctor} className="col">
              <div className="card h-100 shadow-sm">
                <img 
                  src={imagenes[index % imagenes.length]} 
                  className="card-img-top img-fluid" 
                  alt={doctor.nombre}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{doctor.nombre}</h5>
                  <h6 className="text-muted">{doctor.especialidad}</h6>
                  <p className="text-secondary small mb-0">Licencia: {doctor.licenciaMedica}</p>
                  {doctor.descripcion && (
                    <p className="card-text mt-2">{doctor.descripcion}</p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleInformacion(doctor)}
                  >
                    Más Información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctores;

  