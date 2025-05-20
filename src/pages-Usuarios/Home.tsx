//import React from 'react';
//import  '../estilos/carrusel.css';
//import styles from '../estilos/carrusel.module.css';

import { Link } from 'react-router-dom';



const Home = () => {
  return (
    <div className="inicio">
      {/* Sección Hero */}
      <header className="hero-section py-3" style={{ backgroundColor: '#cceeff' }}>
        <div className="container text-center">
          <h1 className="text-center mb-3">Hospital Health Care</h1>
          <p className="text-center mb-3">Cuidando tu salud con excelencia desde 1995</p>
        </div>
      </header>
      <br></br>
      {/* Carrusel Bootstrap */}
      <div id="carouselExampleCaptions" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src="/LoginMedicos.jpg" 
              className="d-block w-100" 
              alt="Médicos trabajando"
              style={{ height: '500px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50">
              <h5>Profesionales Calificados</h5>
              <p>Contamos con el mejor equipo médico especializado</p>
            </div>
          </div>
          
          <div className="carousel-item">
            <img 
              src="/DoctorCardio.jpg" 
              className="d-block w-100" 
              alt="Cardiólogo en consulta"
              style={{ height: '500px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50">
              <h5>Tecnología de Punta</h5>
              <p>Equipamiento moderno para tu diagnóstico preciso</p>
            </div>
          </div>
          
          <div className="carousel-item">
            <img 
              src="/dtoCardiologia.jpg" 
              className="d-block w-100" 
              alt="Departamento de Cardiología"
              style={{ height: '500px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50">
              <h5>Instalaciones Modernas</h5>
              <p>Ambientes diseñados para tu comodidad y seguridad</p>
            </div>
          </div>
        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Sección principal */}
      <section className="container mb-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="mb-4">Bienvenido a Nuestro Centro Médico</h2>
            <p className="lead">
              En Hospital Health Care nos preocupamos por tu bienestar. Ofrecemos atención médica 
              especializada con tecnología de última generación y un equipo humano altamente 
              calificado.
            </p>
            <p>Agenda citas con nuestros especialistas:</p>
            <ul className="list-unstyled">
              <li>✔ Amplio cuadro médico</li>
              <li>✔ Atención 24 horas</li>
              <li>✔ Citas online</li>
              <li>✔ Seguimiento personalizado</li>
            </ul>
            <Link to="/Profile" className="btn btn-primary btn-lg mt-3">
              Registrarse
            </Link>
          </div>
          <div className="col-md-6">
            <img 
              src="/HospitalInterno.jpg" 
              alt="Interior del hospital" 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>
      </section>
      <footer className="hero-section py-3" style={{ backgroundColor: '#cceeff' }}>
        <div className="container text-center">
          <p>Contacto: (555) 123-4567 | contacto@hospitalsanjose.com</p>
          <p>Av. Principal 123, Ciudad</p>
          <p>&copy; 2025 Hospital Health Care</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
  