import React, { useState, useEffect, useCallback } from 'react';
import { METRICS_CONFIG } from './analytics_config.js'; 

const API_URL = 'http://localhost:8000/api/v1/analytics/pivot';

// Métricas que queremos ranquear (Top 5)
const RANK_METRICS = [
    { key: 'revenue', metric: 'total_amount', agg: 'SUM', label: 'Melhor Faturamento', format: 'currency' },
    { key: 'ticket', metric: 'total_amount', agg: 'AVG', label: 'Melhor Ticket Médio', format: 'currency' },
    { key: 'prep_time', metric: 'production_seconds', agg: 'AVG', label: 'Melhor Tempo de Preparo', format: 'minutes' },
];

const StoreRankingTab = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função auxiliar para formatar o valor (reutiliza a lógica do ChartDisplay)
    const formatRankValue = (value, formatType) => {
        if (formatType === 'currency') {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        if (formatType === 'minutes') {
            // Converte segundos (valor do DB) para minutos
            return `${(value / 60).toFixed(0)} min`;
        }
        return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    };

    const fetchRankings = useCallback(async () => {
        setLoading(true);
        const fetches = RANK_METRICS.map(m => {
            const payload = {
                metric: m.metric,
                agg_func: m.agg,
                group_by: 'stores.name',
                filters: { date_range: 'last_6m' }
            };
            return fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        });

        try {
            const responses = await Promise.all(fetches);
            const results = await Promise.all(responses.map(res => res.json()));
            
            const compiledRankings = results.map((result, index) => ({
                ...RANK_METRICS[index],
                // Os 5 melhores resultados são os primeiros 5 do array retornado pelo Backend
                top_results: result.data.slice(0, 5) 
            }));
            
            setRankings(compiledRankings);
        } catch (error) {
            console.error("Falha ao carregar rankings:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);


    return (
        <div className="store-ranking-tab">
            <h2>3. 🏆 Rankings de Performance (Top 5)</h2>
            <p>Visão rápida das lojas com melhor desempenho nos últimos 6 meses.</p>

            <div className="ranking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {loading && <p>Carregando rankings...</p>}
                
                {!loading && rankings.map((ranking) => (
                    <div key={ranking.key} className="panel ranking-card">
                        <h3>{ranking.label}</h3>
                        <p style={{ color: '#6c757d', fontSize: '14px' }}>Métrica: {ranking.metric} ({ranking.agg})</p>
                        
                        <ol style={{ paddingLeft: '20px' }}>
                            {ranking.top_results.map((item, idx) => (
                                <li key={item.dimension} style={{ marginBottom: '10px' }}>
                                    <strong>{item.dimension}</strong>: 
                                    <span style={{ float: 'right', fontWeight: 'bold', color: idx < 3 ? '#28a745' : '#333' }}>
                                        {formatRankValue(item.result, ranking.format)}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default StoreRankingTab;