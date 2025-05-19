import { useState } from 'react';

// Definimos la interfaz para las especialidades médicas
interface Especialidad {
  nombre: string;
  descripcion: string;
  experiencia: string;
  imagen: string;
}

const AreasMedicas = () => {
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<Especialidad | null>(null);

  // Array de especialidades con todos los campos requeridos
  const especialidades: Especialidad[] = [
    { 
      nombre: 'Cardiología',
      descripcion: 'Especialidad en el diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio.',
      experiencia: 'Nuestro departamento de Cardiología cuenta con 20 años de experiencia, equipos de última generación y un equipo de 15 especialistas reconocidos a nivel nacional. Realizamos más de 1,000 procedimientos anuales incluyendo cateterismos y cirugías cardíacas.',
      imagen: '/dtoCardiologia.jpg'
    },
    {
      nombre: 'Pediatría',
      descripcion: 'Cuidado integral de la salud infantil desde el nacimiento hasta la adolescencia.',
      experiencia: 'El área de Pediatría cuenta con especialistas en neonatología y cuidados intensivos pediátricos. Contamos con certificación internacional en atención infantil y más de 30 profesionales dedicados al cuidado de los más pequeños.',
      imagen: '/DoctorCardio.jpg'
    },
    {
      nombre: 'Traumatología',
      descripcion: 'Tratamiento de lesiones y enfermedades del sistema musculoesquelético.',
      experiencia: 'Centro de referencia regional en traumatología y ortopedia con quirófanos inteligentes para cirugía de precisión. Especialistas en reemplazos articulares y medicina deportiva, con una tasa de éxito del 98% en intervenciones.',
      imagen: '/HospitalInterno.jpg'
    },
    {
      nombre: 'Neurología',
      descripcion: 'Diagnóstico y tratamiento de trastornos del sistema nervioso.',
      experiencia: 'Unidad de Neurociencias con tecnología de punta para estudios de electromiografía y monitorización cerebral. Equipo multidisciplinario para tratamiento de epilepsia, Parkinson y enfermedades neurodegenerativas.',
      imagen: '/Doctor5.jpg'
    },
    {
      nombre: 'Ginecología',
      descripcion: 'Salud reproductiva femenina y atención durante el embarazo.',
      experiencia: 'Servicio integral de salud femenina con área de maternidad de alta complejidad. Programa de seguimiento de embarazo de riesgo y unidad de reproducción asistida con más de 1,200 nacimientos anuales.',
      imagen: '/dtoCardiologia.jpg'
    },
    {
      nombre: 'Oftalmología',
      descripcion: 'Cuidado de la salud visual y tratamiento de enfermedades oculares.',
      experiencia: 'Centro Oftalmológico con tecnología láser de última generación y quirófanos especializados. Realizamos cirugías de catarata, corrección de miopía y tratamiento de enfermedades retinianas.',
      imagen: '/Doctor6.jpg'
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Áreas Médicas de Nuestro Hospital</h2>
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {especialidades.map((especialidad, index) => (
          <div key={index} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={especialidad.imagen} 
                className="card-img-top img-fluid" 
                alt={especialidad.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-primary">{especialidad.nombre}</h5>
                <p className="card-text">{especialidad.descripcion}</p>
              </div>
              <div className="card-footer bg-transparent">
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => setSelectedEspecialidad(especialidad)}
                >
                  Más información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEspecialidad && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title text-primary">{selectedEspecialidad.nombre}</h3>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedEspecialidad(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={selectedEspecialidad.imagen}
                      alt={selectedEspecialidad.nombre}
                      className="img-fluid rounded mb-3"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-secondary mb-3">Experiencia y Tecnología</h5>
                    <p className="text-muted">{selectedEspecialidad.experiencia}</p>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>Especialistas:</strong> Más de 10 profesionales certificados
                      </li>
                      <li className="list-group-item">
                        <strong>Tecnología:</strong> Equipos de última generación
                      </li>
                      <li className="list-group-item">
                        <strong>Certificaciones:</strong> Internacionales en calidad de atención
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setSelectedEspecialidad(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasMedicas;