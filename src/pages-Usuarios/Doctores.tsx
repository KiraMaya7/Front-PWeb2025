//import React from 'react';

const Doctores = () => {
  const especialidades = [
    { 
      nombre: 'Cardiología',
      imagen: '/dtoCardiologia.jpg', 
      descripcion: 'Especialidad en el diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio.'
    },
    {
      nombre: 'Pediatría',
      imagen: '/DoctorCardio.jpg',
      descripcion: 'Cuidado integral de la salud infantil desde el nacimiento hasta la adolescencia.'
    },
    {
      nombre: 'Traumatología',
      imagen: '/dtoCardiologia.jpg',
      descripcion: 'Tratamiento de lesiones y enfermedades del sistema musculoesquelético.'
    },
    {
      nombre: 'Neurología',
      imagen: '/DoctorCardio.jpg',
      descripcion: 'Diagnóstico y tratamiento de trastornos del sistema nervioso.'
    },
    {
      nombre: 'Ginecología',
      imagen: '/dtoCardiologia.jpg',
      descripcion: 'Salud reproductiva femenina y atención durante el embarazo.'
    },
    {
      nombre: 'Oftalmología',
      imagen: '/DoctorCardio.jpg',
      descripcion: 'Cuidado de la salud visual y tratamiento de enfermedades oculares.'
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Conoce a Nuestros Especialistas</h2>
      <p className="text-center mb-5">
        Contamos con los mejores Profesionales para brindarte el mejor servicio que te mereces tú y tu Familia</p>
      
      {/* Cambiado a row-cols-md-2 para 2 columnas en pantallas medianas */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {especialidades.map((especialidad, index) => (
          <div key={index} className="col">
            <div className="card h-100 shadow-sm">
              {/* Imagen dinámica por especialidad */}
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
                <button className="btn btn-outline-primary w-100">
                  Más información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctores;
  