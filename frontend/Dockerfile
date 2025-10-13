# ---------- Stage 1: Install only ----------
FROM node:20 AS base
WORKDIR /app


COPY package.*json ./
RUN npm install
COPY . .

# ---------- Stage 2: Build (only for prod) ----------
FROM base AS builder
ENV VITE_BACKEND_URL=""
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# ---------- Dev stage ----------
FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---------- Prod stage ----------
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]