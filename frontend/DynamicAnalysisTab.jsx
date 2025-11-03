import React, { useState, useEffect, useCallback } from 'react';
import ChartDisplay from './ChartDisplay.jsx';
import MetricSelector from './MetricSelector.jsx';
import FilterPanel from './FilterPanel.jsx';
import SelectionDrawer from './SelectionDrawer.jsx';
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

/*
 * Componente que permite a comparação de métricas entre múltiplas lojas selecionadas.
*/
const DynamicAnalysisTab = ({ metadata }) => {
    const [queryState, setQueryState] = useState(INITIAL_QUERY);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [executionTimeMs, setExecutionTimeMs] = useState(0);

    // Encontra a configuração de formatação para o gráfico atual
    const metricConfig = METRICS_CONFIG.find(
        (m) => m.metric === queryState.metric && m.agg === queryState.agg_func
    );

    const handleQueryUpdate = (key, value) => {
        setQueryState(prev => {
            // Se for atualização de métrica ou agregação (MetricSelector)
            if (key === 'metric' || key === 'agg_func') {
                return { ...prev, [key]: value };
            }
            // Se for atualização de filtro (FilterPanel ou SelectionDrawer)
            if (key === 'date_range' || key === 'store_ids' || key === 'channel_ids') {
                return {
                    ...prev,
                    filters: { ...prev.filters, [key]: value },
                };
            }
            return prev;
        });
    };
    
    // Inicializa a seleção de lojas assim que os metadados estiverem disponíveis
    useEffect(() => {
        if (metadata?.stores?.length > 0 && queryState.filters.store_ids.length === 0) {
            const initialSelectedStoreIds = metadata.stores.map((s) => s.id).slice(0, 2);
            setQueryState((prev) => ({
                ...prev,
                filters: {
                    ...prev.filters,
                    store_ids: initialSelectedStoreIds,
                },
            }));
        }
    }, [metadata, queryState.filters.store_ids]);

    // Efeito para buscar os dados sempre que a query mudar
    useEffect(() => {
        const fetchData = async () => {
            // Evita requisições se o usuário ainda não selecionou 2 lojas
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

                if (!response.ok) throw new Error('Falha na requisição da análise dinâmica.');

                const result = await response.json();
                setChartData(result.data);
                setExecutionTimeMs(performance.now() - startTime);
            } catch (error) {
                console.error('Erro ao buscar dados de análise dinâmica:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [queryState]);

    return (
        <div className="dynamic-analysis-tab">
            <h2>2. 📊 Comparação Dinâmica de Lojas</h2>
            <p>
                Selecione as métricas e use a lateral para escolher as lojas que deseja comparar
                diretamente no gráfico.
            </p>

            <div className="layout-row">
                {/* COLUNA 1: CONTROLES */}
                <div className="col-controls panel" style={{ flex: 1.5 }}>
                    {/* 1. SELEÇÃO DE MÉTRICAS */}
                    <h3 className="mt-4">1. 📊 Métrica de Comparação</h3>
                    <MetricSelector 
                        queryState={queryState} 
                        setQueryState={handleQueryUpdate}
                    />

                    {/* 2. FILTRO DE PERÍODO (APENAS DATA) */}
                    <h3 className="mt-4">2. 📅 Filtro de Período</h3>
                    <FilterPanel
                        queryState={queryState}
                        setQueryState={setQueryState} 
                        availableStores={[]}
                        availableChannels={[]}
                    />

                    {/* 3. GAVETA DE SELEÇÃO DE LOJAS E CANAIS */}
                    <SelectionDrawer
                        queryState={queryState}
                        setQueryState={setQueryState} 
                        metadata={metadata} 
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

                    {/* Mensagem de UX: guia o usuário a selecionar as lojas */}
                    {queryState.filters.store_ids.length < 2 && (
                        <p
                            className="text-center"
                            style={{ marginTop: '20px', color: '#6c757d' }}
                        >
                            Selecione pelo menos duas lojas na lateral para iniciar a comparação.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DynamicAnalysisTab;