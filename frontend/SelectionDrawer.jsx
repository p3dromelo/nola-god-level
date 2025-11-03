import React, { useCallback } from 'react';

/**
 * Componente de filtro lateral ("gaveta universal") para selecionar
 * múltiplas lojas e canais de análise.
 */
const SelectionDrawer = ({ queryState, setQueryState, metadata }) => {
    
    // Atualiza os filtros de forma imutável e segura
    const handleToggle = useCallback((key, itemId, isChecked) => {
        setQueryState(prev => {
            const prevFilters = prev.filters || {};
            const currentList = Array.isArray(prevFilters[key]) ? prevFilters[key] : [];

            const newList = isChecked
                ? [...currentList, itemId]
                : currentList.filter(id => id !== itemId);

            return {
                ...prev,
                filters: { ...prevFilters, [key]: newList }
            };
        });
    }, [setQueryState]);

    // Renderiza dinamicamente uma lista de checkboxes (lojas ou canais)
    const renderList = (title, key, list = []) => {
        if (!Array.isArray(list) || list.length === 0) {
            return <p>Carregando {title.toLowerCase()}...</p>;
        }

        const selectedCount = queryState.filters[key]?.length || 0;

        return (
            <div className="list-section mt-4">
                <h4 className="text-lg font-semibold mb-2">
                    {title} <span className="text-gray-500 text-sm">({selectedCount}/{list.length})</span>
                </h4>
                <div className="checkbox-group space-y-1 max-h-56 overflow-y-auto border rounded-lg p-2 bg-white">
                    {list.map(item => (
                        <label
                            key={item.id}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md"
                        >
                            <input
                                type="checkbox"
                                checked={queryState.filters[key]?.includes(item.id) || false}
                                onChange={(e) => handleToggle(key, item.id, e.target.checked)}
                                className="accent-blue-600"
                            />
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <aside className="panel selection-drawer bg-gray-50 p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-1">🛒 Filtros de Segmentação</h2>
            <p className="text-sm text-gray-600 mb-4">
                Selecione lojas e canais para segmentar as análises.
            </p>

            {/* Lojas */}
            {renderList('🏪 Lojas (Multi-Seleção)', 'store_ids', metadata?.stores)}

            {/* Canais */}
            {renderList('📲 Canais (Multi-Seleção)', 'channel_ids', metadata?.channels)}
        </aside>
    );
};

SelectionDrawer.defaultProps = {
    metadata: { stores: [], channels: [] }
};

export default SelectionDrawer;
