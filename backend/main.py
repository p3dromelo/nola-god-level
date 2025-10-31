from fastapi import FastAPI
from backend.router import router

app = FastAPI(
    title="God Level Analytics API",
    description="Motor de Queries Dinâmicas para Restaurantes"
)

app.include_router(
    router,
    prefix="/api/v1"
)