import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

interface Doctor {
  idDoctor: number;
  nombre: string;
  numeroLicencia: string;
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

const Doctores = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<CitaData>({
    idDoctor: 0,
    idUsuario: Number(localStorage.getItem('idUsuario')) || 0,
    fechaHora: '',
    estadoCita: 0,
    notas: ''
  });
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // data fala, falta recibirlas en la base de datos y retornar 
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
        const response = await axios.get('http://localhost:5140/api/Doctores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDoctores(response.data);
      } catch (err) {
        setError('Error al cargar los doctores');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctores();
  }, []);

  const handleAgendarCita = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      idDoctor: doctor.idDoctor
    }));
    setShowModal(true);
  };

  const handleSubmitCita = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5140/api/citas', {
        ...formData,
        fechaHora: new Date(formData.fechaHora).toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        alert('Cita agendada exitosamente!');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al agendar cita:', error);
      alert('Error al agendar la cita');
    }
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
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {doctores.map((doctor, index) => (
          <div key={doctor.idDoctor} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={imagenes[ index % imagenes.length]} 
                className="card-img-top img-fluid" 
                alt={doctor.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-primary">{doctor.nombre}</h5>
                <h6 className="text-muted">{doctor.especialidad}</h6>
                <p className="text-secondary small mb-0">Licencia: {doctor.numeroLicencia}</p>
                {doctor.descripcion && (
                  <p className="card-text mt-2">{doctor.descripcion}</p>
                )}
              </div>
              <div className="card-footer bg-transparent">
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleAgendarCita(doctor)}
                >
                  Agendar Cita
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agendar cita con Dr. {selectedDoctor?.nombre} - {selectedDoctor?.especialidad}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitCita}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora de la cita</Form.Label>
              <Form.Control
                type="datetime-local"
                required
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setFormData({...formData, fechaHora: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Notas adicionales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describa el motivo de su consulta"
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Cita
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctores;
  