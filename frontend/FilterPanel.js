import React from 'react';
import { FILTER_RANGES } from './analytics_config';

// Mock de dados (em produção, viria de um endpoint /api/v1/metadata/stores)
const MOCK_METADATA = {
    stores: [
        { id: 1, name: 'Loja Centro SP' }, 
        { id: 2, name: 'Loja Paulista' }, 
        { id: 3, name: 'Loja Brooklyn' }
    ],
    channels: [
        { id: 10, name: 'iFood' },
        { id: 11, name: 'Rappi' },
        { id: 12, name: 'App Próprio' },
    ]
};

const FilterPanel = ({ queryState, setQueryState }) => {

    // Função que atualiza o filtro de data
    const handleDateFilter = (value) => {
        setQueryState(prev => ({
            ...prev,
            filters: { ...prev.filters, date_range: value }
        }));
    };

    // Função que lida com filtros de lista (checkboxes)
    const handleListFilter = (key, value, isChecked) => {
        setQueryState(prev => {
            const currentList = prev.filters[key] || [];
            
            let newList;
            if (isChecked) {
                newList = [...currentList, value]; // Adiciona ID
            } else {
                newList = currentList.filter(item => item !== value); // Remove ID
            }
            
            return {
                ...prev,
                filters: { ...prev.filters, [key]: newList }
            };
        });
    };

    return (
        <div className="panel filter-panel">
            <h3>📅 Filtro de Período</h3>
            <div className="button-group">
                {FILTER_RANGES.map(r => (
                    <button
                        key={r.value}
                        className={`btn ${queryState.filters.date_range === r.value ? 'active' : ''}`}
                        onClick={() => handleDateFilter(r.value)}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            <h3 className="mt-4">🏪 Filtro de Loja (Multi-Seleção)</h3>
            <div className="checkbox-group">
                {MOCK_METADATA.stores.map(store => (
                    <label key={store.id} className="checkbox-label">
                        <input 
                            type="checkbox" 
                            onChange={(e) => handleListFilter('store_ids', store.id, e.target.checked)} 
                            checked={queryState.filters.store_ids?.includes(store.id) || false}
                        />
                        {store.name}
                    </label>
                ))}
            </div>

            <h3 className="mt-4">📲 Filtro de Canal</h3>
            <div className="checkbox-group">
                {MOCK_METADATA.channels.map(channel => (
                    <label key={channel.id} className="checkbox-label">
                        <input 
                            type="checkbox" 
                            onChange={(e) => handleListFilter('channel_ids', channel.id, e.target.checked)} 
                            checked={queryState.filters.channel_ids?.includes(channel.id) || false}
                        />
                        {channel.name}
                    </label>
                ))}
            </div>
            {/* Adicione outros filtros, como delivery_type, city, etc., aqui. */}
        </div>
    );
};

export default FilterPanel;