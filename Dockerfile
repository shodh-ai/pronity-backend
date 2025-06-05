FROM node:23-slim

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package*.json ./

# Install ALL dependencies (including devDependencies) needed for build
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (tsc needs devDependencies like typescript and @tsconfig/node22)
RUN npm run build

# After the build, prune devDependencies if you want a smaller image
# For now, let's comment this out to ensure everything needed by the runtime is available,
# especially if there's any dynamic aspect or if the start script relies on something from devDeps.
# We can re-enable it if the image size is a concern and everything runs fine without it.
# RUN npm prune --production
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]