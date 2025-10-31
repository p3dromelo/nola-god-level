import React from 'react';
import { METRICS_CONFIG } from './analytics_config';

// Recebe o estado global da query e a função para atualizá-lo
const MetricSelector = ({ queryState, setQueryState }) => {
    
    const handleMetricChange = (config) => {
        // Atualiza metric e agg_func no estado global da query
        setQueryState(prev => ({
            ...prev,
            metric: config.metric,
            agg_func: config.agg,
        }));
    };

    return (
        <div className="panel metric-selector">
            <h3>1. 📊 O Que Medir? </h3>
            <p>Selecione a métrica principal para sua análise.</p>

            <div className="button-group">
                {METRICS_CONFIG.map(m => (
                    <button
                    key={m.label}
                    className={`
                        btn ${queryState.metric === m.metric && queryState.agg_func === m.agg ? 'active' : ''}
                    `}
                    onClick={() => handleMetricChange(m)}
                >
                    {m.label}
                </button>
                ))}
            </div>
        </div>
    );
};

export default MetricSelector;