import React, { useState, useEffect, useCallback } from 'react';
import MetricSelector from './MetricSelector.jsx';
import FilterPanel from './FilterPanel.jsx';
import ChartDisplay from './ChartDisplay.jsx';
import QuickMetrics from './QuickMetrics.jsx';
import QueryControls from './QueryControls.jsx';

const API_URL = 'http://localhost:8000/api/v1/analytics/pivot';

const INITIAL_QUERY_STATE = {
    metric: 'total_amount',
    agg_func: 'SUM',
    group_by: 'channels.name',
    filters: {
        date_range: 'last_30d',
        store_ids: [],
        channel_ids: [],
    },
};

const Dashboard = () => {
    // 🌟 CORREÇÃO CRÍTICA AQUI 🌟
    const [queryState, setQueryState] = useState(INITIAL_QUERY_STATE);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [executionTimeMs, setExecutionTimeMs] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setChartData(null);
        setExecutionTimeMs(0);

        try {
            console.log("Payload Enviado:", queryState);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryState),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            // Atualiza o estado com os dados e o tempo de execução do Backend
            setChartData(result.data);
            setExecutionTimeMs(result.execution_time_ms);

            // Log de Performance
            console.log(`Query executada em: ${result.execution_time_ms.toFixed(2)}ms`);

        } catch (error) {
            console.error("Erro ao buscar dados em analytics:", error.message);
        } finally {
            setLoading(false);
        }
    }, [queryState]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return (
        <div className="dashboard-container">
            <h1>🏆 Analytics: Visão Operacional da Maria</h1>

            {/* LINHA 1: KPIs Rápidos e Controles */}
            <div className="layout-row controls-kpis">
                <QuickMetrics /> {/* Visão rápida do faturamento (servida por MV) */}
            </div>
            {/* LINHA 2: Controles e Definição da Query */}
            <div className="layout-row query-definition">
                <div className="col-controls">
                    <MetricSelector 
                        queryState={queryState} 
                        setQueryState={setQueryState} 
                    />
                    <FilterPanel 
                        queryState={queryState} 
                        setQueryState={setQueryState} 
                    />
                </div>
                <div className="col-grouping">
                    <QueryControls 
                        queryState={queryState} 
                        setQueryState={setQueryState}
                        // Inclui o FilterPanel se você optar por combinar os controles
                    />
                </div>
            </div>

            {/* LINHA 3: Visualização do Resultado */}
            <div className="layout-row chart-view">
                <ChartDisplay 
                    chartData={chartData} 
                    loading={loading}
                    executionTimeMs={executionTimeMs}
                />
            </div>
            
        </div>
    );
};

export default Dashboard;