import React, { useState, useEffect, useCallback } from 'react';
import ChartDisplay from './ChartDisplay.jsx';
import FilterPanel from './FilterPanel.jsx';
import MapComponent from './MapComponent.jsx'; // Componente Mock de Visualização de Mapa
import { METRICS_CONFIG } from './analytics_config.js'; // Para formatação do gráfico

const API_URL = 'http://localhost:8000/api/v1/analytics/pivot';
const GEO_API_URL = 'http://localhost:8000/api/v1/analytics/geo-analysis';

// Estado inicial para análise geográfica: Vendas por Bairro
const INITIAL_GEO_QUERY = {
    metric: 'id',
    agg_func: 'COUNT',
    group_by: 'address.neighborhood', // Agrupa por bairro para a performance
    filters: {
        date_range: 'last_6m',
        channel_type: 'D', // Apenas pedidos Delivery (crucial para esta análise)
    },
};

/*
 * Componente que exibe a densidade de vendas (Mapa de Calor) e a performance de entrega.
 * Requer duas chamadas de API (uma para o mapa, outra para o gráfico de performance).
*/
const GeoAnalysisTab = ({ metadata }) => {
    
    const [geoQueryState, setGeoQueryState] = useState(INITIAL_GEO_QUERY);
    const [performanceData, setPerformanceData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Encontra a formatação para o gráfico de performance (tempo)
    const timeMetricConfig = METRICS_CONFIG.find(m => m.metric === 'delivery_seconds');


    // -----------------------------------------------------------------
    // Lógica de Busca de Dados Geográficos (Duas chamadas de API)
    // -----------------------------------------------------------------
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Chamada 1: Performance de Entrega por Bairro (Gráfico)
            const performancePayload = {
                metric: 'delivery_seconds',
                agg_func: 'AVG',
                group_by: 'address.neighborhood',
                filters: geoQueryState.filters,
            };
            
            // NOTA: A Chamada 2 deve ser implementada no Backend para retornar lat/long
            const [perfResponse, salesResponse] = await Promise.all([
                fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(performancePayload) }),
                fetch(GEO_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(geoQueryState) }),
            ]);

            const perfResult = await perfResponse.json();
            const salesResult = await salesResponse.json();

            setPerformanceData(perfResult.data);
            setHeatmapData(salesResult.data);
            
        } catch (error) {
            console.error("Falha ao carregar dados geográficos:", error.message);
        } finally {
            setLoading(false);
        }
    }, [geoQueryState]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handler para filtros (período, cidade, etc.)
    const handleFilterChange = (key, value) => {
        // Atualiza o filtro de forma genérica
        setGeoQueryState(prev => ({
            ...prev,
            filters: { ...prev.filters, [key]: value }
        }));
    };
    // -----------------------------------------------------------------
    // JSX DE RENDERIZAÇÃO
    // -----------------------------------------------------------------
    return (
        <div className="geo-analysis-tab">
            <h2>3. 📍 Pesquisas Específicas: Análise Geográfica</h2>
            <p>Foque em bairros e cidades para otimizar rotas e marketing. (Apenas pedidos Delivery)</p>

            <div className="layout-row geo-controls-map">
                
                {/* COLUNA 1: Filtros (APENAS DATA) */}
                <div className="col-controls panel">
                    <h3>Filtros e Período</h3>
                    <FilterPanel 
                        queryState={geoQueryState} 
                        setQueryState={setGeoQueryState} // Passa o setter nativo para o FilterPanel
                        // Filtros de Loja/Canal não são necessários aqui (foco em delivery)
                        availableStores={[]}
                        availableChannels={[]}
                    />
                </div>
                
                {/* COLUNA 2: Mapa de Calor (Heatmap) */}
                <div className="col-map panel" style={{ flex: 2 }}>
                    <h3>Mapa de Densidade de Vendas</h3>
                    {loading ? <p>Carregando mapa...</p> : 
                        <MapComponent data={heatmapData} type="heatmap" />
                    }
                </div>
            </div>
            
            {/* LINHA 2: Gráfico de Performance de Entrega */}
            <div className="panel performance-chart-area">
                <h3>Tempo Médio de Entrega (Minutos) por Bairro</h3>
                <p>Identifique áreas problemáticas (média ideal: 35 minutos). Áreas acima de 45 minutos indicam urgência.</p> 
                
                {loading ? (
                    <p>Carregando performance...</p> 
                ) : ( 
                    <ChartDisplay 
                        chartData={performanceData} 
                        type="bar" 
                        metricFormat={timeMetricConfig?.format || 'minutes'}
                    />
                )}
            </div>
        </div>
    );
};

export default GeoAnalysisTab;