import React from 'react';
import { FILTER_RANGES } from './analytics_config.js';

/*
 * Componente que lida exclusivamente com o filtro de PERÍODO (data).
 * Foi simplificado para ser reutilizável em todas as abas.
*/
const FilterPanel = ({ queryState, setQueryState, availableStores, availableChannels }) => {
    
    // Função que lida com o filtro de data (recebe o valor da range de tempo)
    const handleDateFilter = (value) => {
        // Usa o setter do estado pai para atualizar APENAS o date_range
        setQueryState(prev => ({
            ...prev,
            filters: { ...prev.filters, date_range: value }
        }));
    };

    return (
        <div className="panel filter-panel">
            
            {/* 1. FILTRO DE PERÍODO (BOTÕES) */}
            <h3>📅 Filtro de Período</h3>
            <div className="button-group">
                {FILTER_RANGES.map(r => (
                    <button
                        key={r.value}
                        // Destaca o botão ativo
                        className={`btn ${queryState.filters.date_range === r.value ? 'active' : ''}`}
                        onClick={() => handleDateFilter(r.value)}
                    >
                        {r.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Default props são mantidas por segurança, embora o componente não as utilize mais ativamente.
FilterPanel.defaultProps = {
    availableStores: [],
    availableChannels: []
};

export default FilterPanel;