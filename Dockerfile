# ── Etapa 1: Build React ────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Etapa 2: Flask sirve todo ───────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Dependencias Python
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código Flask
COPY api/ ./api/

# Build de React (desde etapa anterior)
COPY --from=builder /app/dist ./dist

# Variables de entorno por defecto
ENV FLASK_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["gunicorn", "api.app:app", "--bind", "0.0.0.0:10000", "--workers", "2", "--timeout", "60"]
