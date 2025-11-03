from typing import Dict, Any, Tuple, List
import re

# =======================================================================
# 1. MAPAS DE METADADOS
# =======================================================================

# A: MAPA DE DIMENSÕES: Traduz chaves do frontend para colunas SQL e define o JOIN necessário.
DIMENSION_MAP = {
    # Chave (Frontend/Filtro) : {Coluna SQL, Tabela Base para JOIN}

    # Simples (Requer 1 JOIN)
    "stores.name":          {"column": "st.name", "join": "stores"},
    "channels.name":        {"column": "ch.name", "join": "channels"},
    "payment_types.desc":   {"column": "pt.description", "join": "payments"},

    # Complexos (Requer JOINs múltiplos)
    "products.name":        {"column": "p.name", "join": "products"},
    "items.name_custom":    {"column": "i.name", "join": "items_custom"},

    # Agrupamento Temporal
    "date.day":             {"column": "DATE(s.created_at)", "join": None},
    "date.hour":            {"column": "EXTRACT(HOUR FROM s.created_at)", "join": None},    
    "address.neighborhood": {"column": "da.neighborhood", "join": "delivery_addresses"},

    # Filtros Diretos (Colunas que podem ser filtradas por ID)
    "filter.store_id":      {"column": "s.store_id", "join": None},
    "filter.channel_id":    {"column": "s.channel_id", "join": None},
}

# B: MAPA DE JOINS: Define a string SQL exata para cada 'join' necessário.
JOIN_MAP = {
    "stores": "JOIN stores st ON st.id = s.store_id",
    "channels": "JOIN channels ch ON ch.id = s.channel_id",
    # CORREÇÃO: pt.id = pay.payment_type_id
    "payments": "JOIN payments pay ON pay.sale_id = s.id JOIN payment_types pt ON pt.id = pay.payment_type_id",

    "products": "JOIN product_sales ps ON ps.sale_id = s.id JOIN products p ON p.id = ps.product_id",

    # Customizações: sales -> product_sales -> item_product_sales -> items
    "items_custom": "JOIN product_sales ps ON ps.sale_id = s.id JOIN item_product_sales ips ON ips.product_sale_id = ps.id JOIN items i ON i.id = ips.item_id",

    "delivery_addresses": "JOIN delivery_addresses da ON da.sale_id = s.id",
}

# =======================================================================
# 2. FUNÇÃO CENTRAL
# =======================================================================

def build_analytics_query(metric: str, agg_func: str, group_by: str, filters: Dict[str, Any]) -> Tuple[str, List]:
    
    # 1. VALIDAÇÃO, MAPEAMENTO DE DIMENSÃO E MÉTRICA
    if group_by not in DIMENSION_MAP:
        raise ValueError(f"Dimensão de agrupamento inválida: {group_by}")
    
    dim_data = DIMENSION_MAP[group_by]
    group_by_col = dim_data['column']
    
    metric_col = f"s.{metric}"
    sql_joins = set()
    if dim_data['join']:
        sql_joins.add(dim_data['join'])

    if metric.startswith('items.'):
        # Ex: metric = 'items.additional_price' -> ips.additional_price
        metric_col = f"ips.{metric.split('.')[-1]}"
        
        # Garante que o JOIN de customização (ips) esteja sempre presente
        sql_joins.add('items_custom')

    # 2. CONSTRUÇÃO DE JOINS ADICIONAIS DE FILTRO
    
    # Junta os JOINs necessários para o GROUP BY e para os FILTROS
    for filter_key in filters.keys():
        if filter_key.startswith('filter.'):
            # Se for um filtro por dimensão (ex: filter.city), adicione o JOIN
            if filter_key in DIMENSION_MAP and DIMENSION_MAP[filter_key]['join']:
                sql_joins.add(DIMENSION_MAP[filter_key]['join'])
    
    joins_string = " ".join([JOIN_MAP[join_key] for join_key in sql_joins])

    # 3. CLÁUSULAS SELECT, FROM E AGRUPAMENTO
    sql_select = f"{agg_func.upper()}({metric_col}) AS result, {group_by_col} AS dimension"
    sql_from = "FROM sales s"
    sql_group_by = f"GROUP BY {group_by_col}"

    # 4. CLÁUSULA WHERE (FILTROS DE ALTA PERFORMANCE)
    where_clauses = []
    filter_params = []

    # Filtro Obrigatório de Negócio: APENAS VENDAS CONCLUÍDAS
    where_clauses.append("s.sale_status_desc = 'COMPLETED'")

    # Filtro de Data (Otimizado para PostgreSQL com INTERVAL)
    if 'date_range' in filters:
        if filters['date_range'] == 'last_7d':
            where_clauses.append("s.created_at >= NOW() - INTERVAL '7 days'")
        elif filters['date_range'] == 'last_30d':
            where_clauses.append("s.created_at >= NOW() - INTERVAL '30 days'")
        elif filters['date_range'] == 'last_6m':
            where_clauses.append("s.created_at >= NOW() - INTERVAL '6 months'")
    
    # Filtro 1: store_ids (Exemplo de filtro por IDs na tabela 'sales')
    if 'store_ids' in filters and filters['store_ids']:
        store_ids = filters['store_ids']
        if not isinstance(store_ids, list): store_ids = [store_ids]
        
        placeholders = ', '.join(['%s'] * len(store_ids))
        where_clauses.append(f"s.store_id IN ({placeholders})")
        filter_params.extend(store_ids)

    # Filtro 2: channel_ids (Exemplo de filtro por IDs na tabela 'sales')
    if 'channel_ids' in filters and filters['channel_ids']:
        channel_ids = filters['channel_ids']
        if not isinstance(channel_ids, list): channel_ids = [channel_ids]
        
        placeholders = ', '.join(['%s'] * len(channel_ids))
        where_clauses.append(f"s.channel_id IN ({placeholders})")
        filter_params.extend(channel_ids)

    # Filtro 3: Filtro de String por Tipo de Entrega (Requer JOIN: delivery_addresses)
    if 'delivery_type' in filters and filters['delivery_type']:
        where_clauses.append("da.delivery_type = %s") 
        filter_params.append(filters['delivery_type'])
        sql_joins.add('delivery_addresses') # Garante que o JOIN seja adicionado

    sql_where = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    # 5. MONTAGEM FINAL
    final_query = f"""
        SELECT 
            {sql_select} 
        {sql_from} 
        {joins_string} 
        {sql_where} 
        {sql_group_by} 
        ORDER BY result DESC 
        LIMIT 100;
    """
    
    # Retorna a query SQL pronta e os parâmetros de filtro (para execução segura)
    return final_query, filter_params