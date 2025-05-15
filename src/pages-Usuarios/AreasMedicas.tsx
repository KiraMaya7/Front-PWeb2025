
//import React from 'react';

const AreasMedicas = () => {
  const especialidades = [
    { 
      nombre: 'Cardiología',
      descripcion: 'Especialidad en el diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio.'
    },
    {
      nombre: 'Pediatría',
      descripcion: 'Cuidado integral de la salud infantil desde el nacimiento hasta la adolescencia.'
    },
    {
      nombre: 'Traumatología',
      descripcion: 'Tratamiento de lesiones y enfermedades del sistema musculoesquelético.'
    },
    {
      nombre: 'Neurología',
      descripcion: 'Diagnóstico y tratamiento de trastornos del sistema nervioso.'
    },
    {
      nombre: 'Ginecología',
      descripcion: 'Salud reproductiva femenina y atención durante el embarazo.'
    },
    {
      nombre: 'Oftalmología',
      descripcion: 'Cuidado de la salud visual y tratamiento de enfermedades oculares.'
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Áreas Médicas de Nuestro Hospital</h2>
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {especialidades.map((especialidad, index) => (
          <div key={index} className="col">
            <div className="card h-100 shadow-sm">
              {/*Modificar para una imagen por especialidad pendiente*/}
              <img 
                src="/dtoCardiologia.jpg" 
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

export default AreasMedicas;