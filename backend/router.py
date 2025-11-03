from fastapi import APIRouter, HTTPException
import time
import psycopg2
from typing import List, Dict, Any

from backend.query_builder import build_analytics_query
from backend.database import get_db_connection
from backend.models import PivotRequest 
from backend.models import AnalyticsResponse # Assumindo que este modelo está definido

router = APIRouter()

# =======================================================================
# 1. ROTA DE STATUS E METADADOS
# =======================================================================

@router.get("/status")
def get_status():
    """ Verifica a conexão com o DB e a contagem de dados. """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM sales;")
        sales_count = cursor.fetchone()[0]
        cursor.close()
        return {
            "status": "ok",
            "message": "Conexão com DB bem-sucedida e dados carregados.",
            "total_sales": int(sales_count)
        }
    except psycopg2.Error as e:
        raise HTTPException(status_code=503, detail=f"DB Connection Failed: {e}")
    finally:
        if conn:
            conn.close()


# =======================================================================
# 2. ROTAS ANALÍTICAS (MOTOR DE QUERIES)
# =======================================================================

@router.post("/analytics/pivot")
def get_pivot_data(request_body: PivotRequest): 
    """ Rota principal que recebe o Payload da UI e executa a query dinâmica. """
    conn = None
    try:
        start_time = time.time()
        
        query, params = build_analytics_query(
            request_body.metric, request_body.agg_func, request_body.group_by, request_body.filters
        )

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, tuple(params)) 
        
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        data = [dict(zip(columns, row)) for row in results]
        end_time = time.time()

        return {
            "data": data,
            "execution_time_ms": (end_time - start_time) * 1000,
            "status": "success"
        }
    except Exception as e:
        print(f"Erro na execução da Query: {e}") 
        raise HTTPException(status_code=500, detail=f"Internal Error: {e}")
    finally:
        if conn:
            conn.close()

@router.get("/metadata/filters")
def get_filter_metadata():
    """ Rota para Metadados: Busca a lista completa de lojas e canais para os filtros. """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Busca lojas (ID e Nome)
        cursor.execute("SELECT id, name FROM stores WHERE is_active = TRUE ORDER BY name")
        stores = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]

        # Busca canais (ID e Nome)
        cursor.execute("SELECT id, name FROM channels ORDER BY name")
        channels = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]

        return {"stores": stores, "channels": channels}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load metadata: {e}")
    finally:
        if conn:
            conn.close()
 

@router.get("/metrics/overview")
def get_quick_kpis():
    """ 🌟 Rota para QuickMetrics: Simula a consulta à Materialized View (MV) para KPIs instantâneos. 🌟 """
    # Este endpoint é chamado uma vez pelo Dashboard para o Overview
    
    kpis_data = [
        { "label": "Faturamento Mês Atual", "value": 60598191.78, "trend": -4.19, "isCurrency": True },
        { "label": "Ticket Médio", "value": 355.47, "trend": 0.10, "isCurrency": True },
        { "label": "Total de Pedidos", "value": 179624, "trend": -4.23, "isCurrency": False },
        { "label": "Taxa de Cancelamento", "value": 4.8, "trend": 0.4, "isCurrency": False, "isPercent": True },
    ]
    
    return kpis_data