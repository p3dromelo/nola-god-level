# 🏆 God Level Coder Challenge

## O Problema

Donos de restaurantes gerenciam operações complexas através de múltiplos canais (presencial, iFood, Rappi, app próprio). Eles têm dados de **vendas, produtos, clientes e operações**, mas não conseguem extrair insights personalizados para tomar decisões de negócio.

Ferramentas como Power BI são genéricas demais. Dashboards fixos não respondem perguntas específicas. **Como empoderar donos de restaurantes a explorarem seus próprios dados?**

## Seu Desafio

Construa uma solução que permita donos de restaurantes **criarem suas próprias análises** sobre seus dados operacionais. Pense: "Power BI para restaurantes" ou "Metabase específico para food service".

### O que esperamos

Uma plataforma onde um dono de restaurante possa:
- Visualizar métricas relevantes (faturamento, produtos mais vendidos, horários de pico)
- Criar dashboards personalizados sem escrever código
- Comparar períodos e identificar tendências
- Extrair valor de dados complexos de forma intuitiva

### O que você recebe

- Script para geração de **500.000 vendas** de 6 meses (50 lojas, múltiplos canais)
- Schema PostgreSQL com dados realistas de operação
- Liberdade total de tecnologias e arquitetura
- Liberdade total no uso de AI e ferramentas de geração de código

### O que você entrega

1. Uma solução funcionando (deployed ou local) - com frontend e backend adequados ao banco fornecido
2. Documentação de decisões arquiteturais
3. Demo em vídeo (5-10 min) explicando sua abordagem - mostrando a solução funcional e deployada / rodando na sua máquina, apresentando-a no nível de detalhes que julgar relevante
4. Código bem escrito e testável

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [PROBLEMA.md](./PROBLEMA.md) | Contexto detalhado, persona Maria, dores do usuário |
| [DADOS.md](./DADOS.md) | Schema completo, padrões, volume de dados |
| [AVALIACAO.md](./AVALIACAO.md) | Como avaliaremos sua solução |
| [FAQ.md](./FAQ.md) | Perguntas frequentes |
| [QUICKSTART.md](./QUICKSTART.md) | Tutorial rápido para começar o desafio |

## Avaliação

**Não** estamos avaliando se você seguiu instruções específicas.  
**Sim** estamos avaliando:
- Pensamento arquitetural e decisões técnicas
- Qualidade da solução para o problema do usuário
- Performance e escala
- UX e usabilidade
- Metodologia de trabalho e entrega


## Prazo

Até 03/11/2025 às 23:59.

## Submissão

Mande um email para gsilvestre@arcca.io

Com:
- Link do repositório (público ou nos dê acesso)
- Link do vídeo demo (5-10 min)
- Link do deploy (opcional mas valorizado)
- Documento de decisões arquiteturais

## Suporte
------ VOLTAR
- 💬 **Discord**: [link do servidor]
- 📧 **Email**: gsilvestre@arcca.io
- 📧 **Telefone**: (11) 93016 - 3509

---

## ⚙️ Comandos Úteis

```bash
# Parar serviços
docker-compose down

# Resetar dados (CUIDADO: apaga tudo)
docker-compose down -v
docker-compose up -d postgres
docker-compose run --rm data-generator

# Ver logs da geração
docker-compose logs -f data-generator

# Backup do banco
docker-compose exec postgres pg_dump -U challenge challenge_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U challenge challenge_db < backup.sql
```

---

**Não queremos que você adivinhe o que queremos. Queremos ver como VOCÊ resolveria este problema.**

_Nola • 2025_
