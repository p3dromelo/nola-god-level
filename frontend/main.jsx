import React from 'react';
import ReactDOM from 'react-dom/client';

// Importa o componente principal do Dashboard
import Dashboard from './Dashboard.jsx'; 
// import './index.css'; // Opcional: Se você tiver estilos globais

// Este arquivo inicializa a aplicação React e a renderiza na div#root do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O componente Dashboard é a raiz da sua interface */}
    <Dashboard />
  </React.StrictMode>,
);