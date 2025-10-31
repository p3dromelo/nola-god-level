# backend/router.py

from fastapi import APIRouter, HTTPException
import time
import psycopg2
from typing import List, Dict, Any

# Importações de módulos (Assumindo que existem e são absolutas)
from backend.query_builder import build_analytics_query
from backend.database import get_db_connection
from backend.models import PivotRequest 

router = APIRouter()

# ----------------------------------------------------
# A. ROTA CRÍTICA PARA TESTAR CONEXÃO (Corrigida)
# ----------------------------------------------------

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

# ----------------------------------------------------
# B. ROTA PRINCIPAL DE ANALYTICS (Corrigida)
# ----------------------------------------------------

@router.post("/analytics/pivot")
def get_pivot_data(request_body: PivotRequest): 
    conn = None
    try:
        start_time = time.time()
        
        # 1. Construir Query
        query, params = build_analytics_query(
            request_body.metric, request_body.agg_func, request_body.group_by, request_body.filters
        )

        # 2. Executar Query no Banco (Execução Segura)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, tuple(params)) 
        
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        # 3. Formatar Resultado
        data = [dict(zip(columns, row)) for row in results]
        end_time = time.time()

        return {
            "data": data,
            "execution_time_ms": (end_time - start_time) * 1000,
            "status": "success"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Erro de Validação: {str(e)}")
    except Exception as e:
        print(f"Erro na execução da Query: {e}") 
        raise HTTPException(status_code=500, detail=f"Internal Error: {e}")
    finally:
        if conn:
            conn.close()