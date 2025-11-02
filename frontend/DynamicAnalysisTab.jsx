import React, { useState, useEffect, useCallback } from 'react';
import ChartDisplay from './ChartDisplay.jsx';
import MetricSelector from './MetricSelector.jsx';
import FilterPanel from './FilterPanel.jsx';
import SelectionDrawer from './SelectionDrawer.jsx'; // Novo componente de filtros de lista
import { METRICS_CONFIG } from './analytics_config.js'; 

const API_URL = 'http://localhost:8000/api/v1/analytics/pivot';

// Estado inicial: Agrupa por loja (stores.name) para o eixo X de comparação
const INITIAL_QUERY = {
    metric: 'total_amount',
    agg_func: 'SUM',
    group_by: 'stores.name', 
    filters: {
        date_range: 'last_30d',
        store_ids: [],
    },
};

const DynamicAnalysisTab = ({ metadata }) => {
    const [queryState, setQueryState] = useState(INITIAL_QUERY);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [executionTimeMs, setExecutionTimeMs] = useState(0);

    // Usa a métrica atual para formatar valores no gráfico
    const metricConfig = METRICS_CONFIG.find(m => m.value === queryState.metric);

    // Lógica de fetch que depende do queryState
    const fetchData = useCallback(async () => {
        // 🚨 CRITÉRIO DE INICIALIZAÇÃO: Apenas busca dados se 2 ou mais lojas forem selecionadas.
        if (queryState.filters.store_ids.length < 2) {
            setChartData(null);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const startTime = performance.now();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryState),
            });
            if (!response.ok) throw new Error("Falha na requisição da análise dinâmica.");
            
            const result = await response.json();
            setChartData(result.data);
            setExecutionTimeMs(performance.now() - startTime);

        } catch (error) {
            console.error("Erro ao buscar dados de análise dinâmica:", error);
        } finally {
            setLoading(false);
        }
    }, [queryState]); // Dependência no estado de query

    useEffect(() => {
        // Dispara o fetch toda vez que o queryState mudar (via fetchData)
        fetchData();
    }, [fetchData]);

    return (
        <div className="tab-content-inner">
            <div className="layout-row">
                {/* COLUNA 1: FILTROS E METRICAS */}
                <div className="col-controls panel">
                    
                    {/* 1. SELEÇÃO DE MÉTRICAS */}
                    <MetricSelector 
                        queryState={queryState} 
                        setQueryState={setQueryState} 
                    />
                    
                    {/* 2. FILTRO DE PERÍODO (Data - Agora apenas de data) */}
                    <h3>🗓️ Filtro de Período</h3>
                    <FilterPanel 
                        queryState={queryState} 
                        setQueryState={setQueryState} 
                    />

                    {/* 3. GAVETA DE SELEÇÃO DE LOJAS E CANAIS (Fonte principal dos filtros) */}
                    <SelectionDrawer 
                        queryState={queryState} 
                        setQueryState={setQueryState} 
                        metadata={metadata} // 🌟 Aqui está o metadata que o SelectionDrawer usa
                    />
                    
                </div>

                {/* COLUNA 2: GRÁFICO CENTRAL DE COMPARAÇÃO */}
                <div className="col-chart panel" style={{ flex: 3 }}>
                    <h3>{metricConfig?.label || 'Resultado'} por Loja</h3>
                    <ChartDisplay 
                        chartData={chartData} 
                        loading={loading}
                        executionTimeMs={executionTimeMs}
                        metricFormat={metricConfig?.format || 'currency'} 
                    />
                    {/* Mensagem de UX: Guia o usuário a selecionar as lojas */}
                    {queryState.filters.store_ids.length < 2 && (
                        <p className="text-center" style={{marginTop: '20px', color: '#6c757d'}}>
                            Selecione pelo menos duas lojas na lateral para iniciar a comparação.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Adiciona um defaultProps para segurança
DynamicAnalysisTab.defaultProps = {
    metadata: { stores: [], channels: [] } 
};

export default DynamicAnalysisTab;