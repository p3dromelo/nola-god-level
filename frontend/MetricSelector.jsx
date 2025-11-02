import React from 'react';
import { METRICS_CONFIG } from './analytics_config.js';

/*
 * Componente para selecionar a métrica e função de agregação (SUM, AVG, COUNT).
 * Comunica a seleção como chave/valor para o componente pai.
*/
const MetricSelector = ({ queryState, setQueryState }) => {
    
    // Handler otimizado para disparar as duas mudanças necessárias (metric e agg_func)
    const handleSelect = (metricConfig) => {
        // 1. Atualiza a Métrica (Ex: 'metric', 'total_amount')
        setQueryState('metric', metricConfig.metric);
        
        // 2. Atualiza a Função de Agregação (Ex: 'agg_func', 'AVG')
        // O componente pai (HomeTab) recebe essas duas chamadas e atualiza o estado.
        setQueryState('agg_func', metricConfig.agg);
    };

    return (
        <div className="panel metric-selector">
            <h3>1. 📊 O Que Medir?</h3>
            <p>Selecione a métrica principal para sua análise.</p>

            <div className="button-group">
                {METRICS_CONFIG.map(m => (
                    <button
                        key={m.label}
                        className={`
                            btn ${queryState.metric === m.metric && queryState.agg_func === m.agg ? 'active' : ''}
                        `}
                        onClick={() => handleSelect(m)}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MetricSelector;