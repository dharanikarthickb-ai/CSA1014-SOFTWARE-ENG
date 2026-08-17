FROM node:20-alpine

WORKDIR /app

# Install dependencies first so this layer is cached across code-only changes
COPY package.json ./
RUN npm install --production

# Application code
COPY server.js ./

# Run as a non-root user for defense-in-depth
USER node

EXPOSE 5000

# Docker/Compose use this to know when the container is actually ready,
# not just "process started"
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["npm", "start"]
