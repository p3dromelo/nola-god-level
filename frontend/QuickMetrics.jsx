import React, { useState, useEffect } from 'react';

const KPI_API_URL = 'http://localhost:8000/api/v1/metrics/overview'; 

/*
 * Componente que exibe os KPIs mais importantes de forma rápida (overview).
 * Consulta a API de Metadados/Visão Geral para garantir performance instantânea.
*/
const QuickMetrics = () => {
    // 1. Inicializa o estado com um array vazio
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função que formata o valor baseado no tipo (moeda, percentual, número)
    const formatValue = (kpi) => {
        if (!kpi || kpi.value === undefined || kpi.value === null) return 'N/A';
        
        let formatted = kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: kpi.isCurrency ? 2 : 0, maximumFractionDigits: 2 });
        
        if (kpi.isCurrency) {
            formatted = `R$ ${formatted}`;
        }
        if (kpi.isPercent) {
            formatted = `${formatted}%`;
        }
        return formatted;
    };

    // 2. Implementação do Fetch Real (Simula a consulta à MV)
    useEffect(() => {
        async function fetchKpis() {
             try {
                 const response = await fetch(KPI_API_URL);
                 if (!response.ok) throw new Error("API Falhou ao buscar KPIs");
                 
                 const data = await response.json();
                 setKpis(data); 
             } catch (error) {
                 console.error("Falha ao carregar KPIs:", error);
                 setKpis([]);
             } finally {
                 setLoading(false);
             }
        }
        
        // Simular o tempo de execução da MV (o ideal seria carregar em 50ms)
        const timer = setTimeout(() => { fetchKpis(); }, 50); 
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="quick-metrics-panel">
            <h3>Overview Rápido (Mês)</h3>
            <div className="kpi-grid">
                {/* 3. Ajuste do Loading State */}
                {loading && kpis.length === 0 && <p>Carregando KPIs...</p>}
                
                {!loading && kpis.length === 0 && <p>Nenhuma métrica de overview disponível.</p>}

                {!loading && kpis.length > 0 && kpis.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-label">{kpi.label}</div>
                        <div className="kpi-value">{formatValue(kpi)}</div>
                        <div className={`kpi-trend ${kpi.trend >= 0 ? 'positive' : 'negative'}`}>
                            {kpi.trend > 0 ? '▲' : '▼'} {Math.abs(kpi.trend)}% vs Mês Anterior
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickMetrics;