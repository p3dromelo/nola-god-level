import React from 'react';
import { DIMENSIONS_CONFIG, FILTER_RANGES } from './analytics_config';

const QueryControls = ({ queryState, setQueryState, availableStores, availableChannels }) => {

    // Função que atualiza a dimensão de agrupamento (group_by)
    const handleGroupChange = (e) => {
        setQueryState(prev => ({ ...prev, group_by: e.target.value })) ;
    };

    // Função que atualiza o filtro de data
    const handleDateFilter = (value) => {
        setQueryState(prev => ({
            ...prev,
            filters: { ...prev.filters, date_range: value }
        }));
    };

    // Função que lida com filtros de lista (ex: store_ids, channel_ids)
    const handleListFilter = (key, value, isChecked) => {
        setQueryState(prev => {
            const currentList = prev.filters[key] || [];

            let newList;
            if (isChecked) {
                newList = [...currentList, value];
            } else {
                newList = currentList.filter(item => item !== value);
            }

            return{
                ...prev,
                filters: { ...prev.filters, [key]: newList }
            };
        });
    };

    return (
    <div className="panel query-controls">
        {/* SEÇÃO DE AGRUPAMENTO */}
        <h3>2. 📐 Agrupar Por:</h3>
        <select
            onChange={handleGroupChange}
            value={queryState.group_by}
            className="select-group-by"
            >
                {DIMENSIONS_CONFIG.map(d => (
                    <option key={d.group_by} value={d.group_by}>{d.label}</option>
                ))}
            </select>
            {/* SEÇÃO DE FILTROS DE PERÍODO */}
            <h3>3. 🗓️ Filtro de Período</h3>
            <div className="button-group">
                {FILTER_RANGES.map(r => (
                    <button
                        key={r.value}
                        className={`btn ${queryState.filter.date_range === r.value ? 'active' : ''}`}
                        onClick={() => handleDateFilter(r.value)}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* SEÇÃO DE FILTROS DE LOJA (Exemplo) */}
            <h3>4. 🏪 Filtro de Loja</h3>
            <div className="checkbox-group">
                {/* Aqui você mapearia as lojas disponíveis vindas de um endpoint de metadados */}
                {availableStores.map(store => (
                <label key={store.id}>
                    <input 
                    type="checkbox" 
                    onChange={(e) => handleListFilter('store_ids', store.id, e.target.checked)} 
                    checked={queryState.filters.store_ids?.includes(store.id)}
                    />
                    {store.name}
                </label>
                ))}
            </div>
        </div>
    );
};

QueryControls.defaultProps = {
    availableStores: [
        { id: 1, name: 'Loja Centro SP' }, 
        { id: 2, name: 'Loja Paulista' }, 
        { id: 3, name: 'Loja Brooklyn' }
    ],
    availableChannels: []
};

export default QueryControls;