import React from 'react';

/*
 * Componente que gerencia a seleção de múltiplas lojas e canais (Gaveta Universal).
 * Atualiza o 'queryState' do componente pai (HomeTab, DynamicAnalysisTab).
*/
const SelectionDrawer = ({ queryState, setQueryState, metadata }) => {
    
    // Handler unificado para Lojas (store_ids) e Canais (channel_ids)
    const handleToggle = (key, itemId, isChecked) => {
        setQueryState(prev => {
            // Garante que o array seja criado se não existir
            const currentList = prev.filters[key] || [];
            
            let newList;
            if (isChecked) {
                newList = [...currentList, itemId]; // Adiciona ID
            } else {
                newList = currentList.filter(id => id !== itemId); // Remove ID
            }
            
            // Atualiza o estado filters com a nova lista (imutabilidade)
            return {
                ...prev,
                filters: { ...prev.filters, [key]: newList }
            };
        });
    };

    // Função auxiliar para renderizar a lista de checkboxes para lojas OU canais
    const renderList = (title, key, list) => {
        // Se o array de metadados for vazio, exibe o loading
        if (!list || list.length === 0) return <p>Carregando {title.toLowerCase()}...</p>;

        const selectedCount = queryState.filters[key]?.length || 0;
        
        return (
            <div className="list-section mt-4">
                <h4>{title} ({selectedCount}/{list.length})</h4>
                <div className="checkbox-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {list.map(item => (
                        <label key={item.id} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleToggle(key, item.id, e.target.checked)} 
                                checked={queryState.filters[key]?.includes(item.id) || false}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="panel selection-drawer">
            <h2>🛒 Filtros de Segmentação</h2>
            <p>Selecione lojas e canais para segmentar a análise.</p>
            
            {/* 1. LOJAS (Chave: store_ids) */}
            {renderList('🏪 Lojas (Multi-Seleção)', 'store_ids', metadata.stores)}

            {/* 2. CANAIS (Chave: channel_ids) */}
            {renderList('📲 Canais (Multi-Seleção)', 'channel_ids', metadata.channels)}
            
        </div>
    );
};

SelectionDrawer.defaultProps = {
    // Padrão de segurança, caso a prop metadata não seja passada
    metadata: { stores: [], channels: [] }
};

export default SelectionDrawer;