# 1. Clonar o repositório
git clone https://github.com/p3dromelo/nola-god-level.git

cd nola-god-level

# 2. Iniciar todos os serviços (Postgres, FastAPI) e ferramentas (PgAdmin)
##Nota: O Docker irá reconstruir o Backend para aplicar as últimas correções de CORS. ##

docker compose --profile tools up -d postgres backend pgadmin

# 3. Gerar 6 meses de dados de vendas no PostgreSQL
docker compose run --rm data-generator

# 4. Instalar dependências Node (Se for a primeira execução)
cd frontend

npm install

# 5. Iniciar o servidor React/Vite
npm run dev

# 6. Acesso à Aplicação
**Dashboard** http://localhost:5173/ (Acessado após "npm run dev")

**pgAdmin (DB)** http://localhost:5050/ (Email: admin@godlevel.com / Senha: admin)

**FastAPI (API)** http://localhost:8000/api/v1/status (Health Check)
