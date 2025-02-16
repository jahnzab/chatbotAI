# === Frontend Stage (React) ===
FROM node:18 AS frontend
WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy public and src folders
COPY public/ ./public
COPY src/ ./src

# Build React app (optional) or run development server
RUN npm run build || echo "Build failed, using npm start for dev"

# === Backend Stage (FastAPI) ===
FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/ ./backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# === Final Stage (Run Both) ===
FROM python:3.11-slim
WORKDIR /app

# Copy backend and frontend
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app /app/frontend

# Install supervisor
RUN pip install supervisor

# Add supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports for React and FastAPI
EXPOSE 3000 8000

# Start React and FastAPI using npm start and uvicorn
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
