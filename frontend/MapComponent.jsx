import React from 'react';

/*
 * Componente Mock que simula a visualização de um Mapa de Calor.
 * Ele usa os dados reais do Backend para exibir a densidade de vendas por região (bairro).
*/
const MapComponent = ({ data, type }) => {
    
    // Simular que o mapa está carregando a densidade de vendas
    if (!data || data.length === 0) {
        return (
            <div className="map-placeholder" style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f0f4f7' }}>
                <p>Nenhum dado de localização encontrado para o filtro atual.</p>
                <p style={{ color: '#666', fontSize: '14px' }}>Aguardando coordenadas (Latitude/Longitude) do Backend...</p>
            </div>
        );
    }

    // Se houver dados, exibir os top 5 pontos ou bairros de maior densidade
    return (
        <div className="map-display-area">
            <h4>Heatmap: Top 5 Áreas de Maior Venda (Bairro)</h4>
            
            <ul className="location-list" style={{ listStyleType: 'none', padding: 0 }}>
                {data.slice(0, 5).map((item, index) => (
                    <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #eee' }}>
                        {index + 1}. **Bairro:** {item.dimension || 'N/A'} 
                        <span style={{ float: 'right', fontWeight: 'bold', color: index < 2 ? 'red' : 'orange' }}>
                           Vendas: {item.result.toLocaleString('pt-BR')}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MapComponent;