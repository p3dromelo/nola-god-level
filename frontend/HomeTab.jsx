import React, { useState, useEffect, useCallback } from 'react';
import QuickMetrics from './QuickMetrics.jsx'; 
import ChartDisplay from './ChartDisplay.jsx';
import MetricSelector from './MetricSelector.jsx'; 
import FilterPanel from './FilterPanel.jsx';
import { METRICS_CONFIG } from './analytics_config.js'; 

// URL do Backend para o Motor de Queries
const API_URL = 'http://localhost:8000/api/v1/analytics/pivot';

// Estado inicial padrão para o gráfico principal (Faturamento Total por Canal, 6 meses)
const INITIAL_HOME_QUERY = {
    metric: 'total_amount',
    agg_func: 'SUM',
    group_by: 'channels.name', 
    filters: {
        date_range: 'last_6m',
        store_ids: [],
        channel_ids: [],
    },
};

/*
 * Componente que exibe a Visão Geral (Home Tab).
 * Gerencia o estado e o fetch do gráfico principal e inclui o QuickMetrics.
*/
const HomeTab = ({ metadata }) => { // Recebe metadata (lojas/canais) do Dashboard
    
    const [homeChartData, setHomeChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [executionTimeMs, setExecutionTimeMs] = useState(0);
    const [homeQueryState, setHomeQueryState] = useState(INITIAL_HOME_QUERY);
    
    // HANDLER ÚNICO: Lida com a mudança de métricas e filtros
    // Note que FilterPanel e MetricSelector chamam este setter.
    const handleQueryUpdate = (key, value) => {
        setHomeQueryState(prev => {
            // Se a mudança for Métrica/Agregação, atualiza o topo do objeto:
            if (key === 'metric' || key === 'agg_func') {
                return { ...prev, [key]: value };
            }
            
            // Se a mudança for FILTRO (Data, Loja, Canal), atualiza o sub-objeto 'filters':
            if (key === 'date_range' || key === 'store_ids' || key === 'channel_ids') {
                return {
                    ...prev,
                    filters: { ...prev.filters, [key]: value },
                };
            }
            return prev;
        });
    };

    // Lógica para disparar a chamada de API (FastAPI)
    const fetchHomeData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(homeQueryState),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            setHomeChartData(result.data);
            setExecutionTimeMs(result.execution_time_ms);
            
            console.log(`Query executada em: ${result.execution_time_ms.toFixed(2)}ms`);
            
        } catch (error) {
            console.error("Falha ao carregar gráfico Home:", error.message);
            setHomeChartData(null); 
        } finally {
            setLoading(false);
        }
    }, [homeQueryState]);

    
    useEffect(() =>{
        fetchHomeData();
    }, [fetchHomeData]);
    
    
    // Cálculo de Propriedades para Renderização (Título e Formato)
    const currentMetricConfig = METRICS_CONFIG.find(m => 
        m.metric === homeQueryState.metric && m.agg === homeQueryState.agg_func
    );
    const chartTitle = currentMetricConfig ? currentMetricConfig.label : 'Gráfico Principal';
    const metricFormat = currentMetricConfig ? currentMetricConfig.format : 'currency';


    return (
        <div className="home-tab">
            
            {/* LINHA 1: KPIs Mais Importantes (Instântaneo) */}
            <div className="panel overview-kpis">
                 <QuickMetrics /> 
            </div>
            
            {/* LINHA 2: Configuração e Visualização do Gráfico Principal */}
            <div className="layout-row primary-chart-area">
                
                {/* COLUNA ESQUERDA: Controles para o Gráfico Principal */}
                <div className="col-controls panel">
                    
                    {/* SEÇÃO 1: Métrica */}
                    <h3 className="mt-4">1. 📊 O Que Medir?</h3>
                    <MetricSelector 
                        queryState={homeQueryState} 
                        setQueryState={handleQueryUpdate} // Usa o handler unificado
                    />
                    
                    {/* SEÇÃO 2: FILTROS DE PERÍODO (Passamos o setter nativo do estado) */}
                    <h3 className="mt-4">2. 🗓️ Filtros de Análise</h3>
                    
                    <FilterPanel 
                        queryState={homeQueryState} 
                        setQueryState={setHomeQueryState}
                        availableStores={metadata.stores} 
                        availableChannels={metadata.channels} 
                    />
                </div>

                {/* COLUNA DIREITA: Visualização do Gráfico */}
                <div className="col-chart panel">
                    <h3>{chartTitle} por Canal</h3>
                    <ChartDisplay 
                        chartData={homeChartData} 
                        loading={loading}
                        executionTimeMs={executionTimeMs}
                        metricFormat={metricFormat} //PASSA O FORMATO CORRIGIDO (currency/number/minutes)
                    />
                </div>
            </div>
            
            <p className="note mt-3">Utilize as outras abas para análises detalhadas por loja e ranking de lojas.</p>
        </div>
    );
};

HomeTab.defaultProps = {
    metadata: { stores: [], channels: [] } 
};

export default HomeTab;