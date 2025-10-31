from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PivotRequest(BaseModel):
    """
    Define a estrutura da requisição (Payload) esperada pelo Motor de Queries
    no endpoint POST /analytics/pivot.
    """
    metric: str = Field(..., description="Coluna para cálculo (Ex: total_amount)")
    agg_func: str = Field(..., description="Função de agregação (SUM, AVG, COUNT)")
    group_by: str = Field(..., description="Dimensão para agrupar (Ex: channels.name)")

    filters: Dict[str, Any] = Field({}, description="Filtros a serem aplicados (Ex: date_range)")

class AnalyticsResponse(BaseModel):
    """
    Define a estrutura da resposta devolvida pelo Motor de Queries.
    """
    data: List[Dict[str, Any]] = Field(..., description="Lista de resultados agregados.")
    execution_time_ms: float = Field(..., description="Tempo de execução da query em milissegundos.")
    status: str = Field(..., description="Status da requisição (success/error).")