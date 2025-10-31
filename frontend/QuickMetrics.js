import React, { useState, useEffect } from 'react';

const MOCK_KPIS = [
    { label: 'Faturamento Mês Atual', value: 155980.50, trend: 5.2, isCurrency: true },
    { label: 'Ticket Médio', value: 68.45, trend: -1.1, isCurrency: true },
    { label: 'Total de Pedidos', value: 2280, trend: 15.0, isCurrency: false },
    { label: 'Taxa de Cancelamento', value: 4.8, trend: -0.5, isCurrency: false, isPercent: true },
];

const QuickMetrics = () => {
    const [kpis, setKpis] = useState(MOCK_KPIS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 50); 
        return () => clearTimeout(timer);
    }, []);

    const formatValue = (kpi) => {
        let formatted = kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: kpi.isCurrency ? 2 : 0, maximumFractionDigits: 2 });
        if (kpi.isCurrency) {
            formatted = `R$ ${formatted}`;
        }
        if (kpi.isPercent) {
            formatted = `${formatted}%`;
        }
        return formatted;
    };

    return (
        <div className="quick-metrics-panel">
            <h3>Overview Rápido (Mês)</h3>
            <div className="kpi-grid">
                {loading && <p>Carregando KPIs...</p>}
                {!loading && kpis.map((kpi, index) => (
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