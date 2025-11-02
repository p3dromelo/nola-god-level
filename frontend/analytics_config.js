// Mapeamento de Métricas e Funções de Agregação (AGG_FUNC)
// Estes valores se correlacionam diretamente com o backend/query_builder.py

export const METRICS_CONFIG = [
    // ------------------------------------
    // Métricas Financeiras
    // ------------------------------------
    {
        label: 'Faturamento Total (R$)',
        metric: 'total_amount',
        agg: 'SUM',
        format: 'currency',
        description: 'Soma total de vendas concluídas.'
    },
    {
        label: 'Ticket Médio (R$)',
        metric: 'total_amount',
        agg: 'AVG',
        format: 'currency',
        description: 'Valor médio por pedido concluído.'
    },
    {
        label: 'Total de Pedidos',
        metric: 'id',
        agg: 'COUNT',
        format: 'number',
        description: 'Contagem de pedidos concluídos.'
    },
    // ------------------------------------
    // Métricas Operacionais / Margem
    // ------------------------------------
    {
        label: 'Tempo Médio de Preparo (min)',
        metric: 'production_seconds',
        agg: 'AVG',
        format: 'minutes',
        description: 'Média do tempo entre o pedido e o despacho.'
    },
    {
        label: 'Receita de Customizações (R$)',
        metric: 'items.additional_price',
        agg: 'SUM',
        format: 'currency',
        description: 'Receita total gerada por itens extras/adicionais (+bacon).'
    },
];

// Mapeamento de Dimensões para Agrupamento (GROUP_BY)
// Estes valores se correlacionam diretamente com o DIMENSION_MAP no backend/query_builder.py
export const DIMENSIONS_CONFIG = [
    // Dimensões Críticas para Maria
    { label: 'Por Canal de Venda', group_by: 'channels.name' },
    { label: 'Por Loja', group_by: 'stores.name' },
    { label: 'Por Produto Principal', group_by: 'products.name' },
    { label: 'Por Bairro de Entrega', group_by: 'address.neighborhood' },
    { label: 'Por Forma de Pagamento', group_by: 'payment_types.desc' },
    { label: 'Por Hora do Dia', group_by: 'date.hour' },
    { label: 'Por Dia da Semana', group_by: 'date.day_of_week' },
];

// Configurações Padrão de Filtros de Período
export const FILTER_RANGES = [
    { label: 'Últimos 7 Dias', value: 'last_7d' },
    { label: 'Últimos 30 Dias', value: 'last_30d' },
    { label: 'Últimos 6 Meses', value: 'last_6m' },
];