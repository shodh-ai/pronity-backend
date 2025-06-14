FROM node:23-slim

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN chmod +x entrypoint.sh