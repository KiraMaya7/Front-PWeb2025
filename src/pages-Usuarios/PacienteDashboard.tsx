import { Outlet } from 'react-router-dom';

export default function PacienteDashboard() {
  return (
    <div className="container">
      <h2 className="mb-4">Panel del Paciente</h2>
      <Outlet />
    </div>
  );
}

