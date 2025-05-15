const Contacto = () => {
  return (
    <div className="container py-2">
      <h2 className="text-center mb-4">Contáctanos</h2>
      
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row">
                {/* Columna de información */}
                <div className="col-md-6 border-end">
                  <div className="mb-4">
                    <h4><i className="bi bi-telephone me-2"></i>Teléfonos</h4>
                    <p className="ms-4">Emergencias: (+55) 123-4567<br/>
                    Consultas: (+55) 765-4321</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4><i className="bi bi-whatsapp me-2"></i>WhatsApp</h4>
                    <a 
                      href="https://wa.me/5495551234567" 
                      className="btn btn-success ms-4"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Enviar mensaje
                    </a>
                  </div>
                  
                  <div className="mb-4">
                    <h4><i className="bi bi-envelope me-2"></i>Correo</h4>
                    <a 
                      href="mailto:contacto@hospitalsancristo.com" 
                      className="ms-4"
                    >
                      contacto@hospitalsancristo.com
                    </a>
                  </div>
                </div>

                {/* Columna de redes sociales */}
                <div className="col-md-6">
                  <h4 className="mb-3">Redes Sociales</h4>
                  <div className="d-flex flex-column gap-2">
                    <a 
                      href="https://facebook.com" 
                      className="btn btn-primary"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <i className="bi bi-facebook me-2"></i>Facebook
                    </a>
                    <a 
                      href="https://instagram.com" 
                      className="btn btn-danger"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <i className="bi bi-instagram me-2"></i>Instagram
                    </a>
                    <a 
                      href="https://twitter.com" 
                      className="btn btn-info text-white"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <i className="bi bi-twitter-x me-2"></i>Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario simple */}
          <div className="card shadow">
            <div className="card-body">
              <h4 className="mb-3">Formulario de Contacto</h4>
              <form>
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nombre completo" 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Correo electrónico" 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    placeholder="Tu mensaje..." 
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;