export const METRICS_CONFIG = [
    // Métricas Financeiras
    { label: 'Faturamento Total (R$)', metric: 'total_amount', agg: 'SUM', format: 'currency'},
    { label: 'Ticket Médio (R$)', metric: 'total_amount', agg: 'AVG', format: 'currency'},
    { label: 'Total de Pedidos', metric: 'id', agg: 'COUNT', format: 'number'},

    // Metricas Operacionais
    { label: 'Tempo Médio de Preparo (min)', metric: 'production_seconds', agg: 'AVG', format: 'minutes'},
    { label: 'Receita de Customizações (R$)', metric: 'items.additional_price', agg: 'SUM', format: 'currency'},
];

export const DIMENSIONS_CONFIG = [
    // Dimensões Critícas
    { label: 'Por Canal de Venda', group_by: 'channels.name' },
    { label: 'Por Loja', group_by: 'stores.name' }, 
    { label: 'Por Produto Mais Vendido', group_by: 'products.name' },
    { label: 'Por Bairro de Entrega', group_by: 'address.neighborhood' },
    { label: 'Por Hora do Dia', group_by: 'data.hour' },
];

export const FILTER_RANGES = [
    { label: 'Últimos 7 Dias', value: 'Last_7d' },
    { label: 'Últimos 30 Dias', value: 'Last_30d' },
    { label: 'Últimos 6 Meses', value: 'Last_6m' },
];