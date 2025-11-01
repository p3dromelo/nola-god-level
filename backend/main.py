from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.router import router

app = FastAPI(
    title="God Level Analytics API",
    description="Motor de Queries Dinâmicas para Restaurantes"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(
    router,
    prefix="/api/v1"
)