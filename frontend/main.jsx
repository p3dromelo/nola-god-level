import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.jsx';
import './index.css'; 

// Este arquivo inicializa a aplicação React e a renderiza na div#root do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O componente Dashboard é a raiz da sua interface */}
    <Dashboard />
  </React.StrictMode>,
);