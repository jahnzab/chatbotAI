# ---- Frontend Build Stage ----
FROM node:18 AS frontend-builder

WORKDIR /app

# Copy package files first and install dependencies
COPY src/package.json src/package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source files
COPY src ./src

# Build frontend
RUN npm run build

# ---- Backend + Ollama ----
FROM python:3.13

WORKDIR /Defcon_ChatBot

# Install system dependencies
RUN apt-get update && apt-get install -y curl supervisor && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Ollama separately
RUN curl -fsSL https://ollama.com/install.sh | sh

# Upgrade pip & install dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir numpy

# Copy backend dependencies and install them
COPY src/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source files
COPY src .

# Copy built frontend from previous stage into `src/build`
COPY --from=frontend-builder /app/src/build /Defcon_ChatBot/src/build

# Expose backend (8000) and frontend (3000) ports
EXPOSE 8000 3000

# Copy and setup supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Run services using Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

