FROM node:23-slim

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]