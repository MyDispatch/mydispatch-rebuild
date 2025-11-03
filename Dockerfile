# MyDispatch Production Dockerfile - Express Server
# Claude Sonnet 4.5 recommended solution: Static build + Express

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the app (creates dist/ directory)
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-5173}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose port (Railway sets PORT env var)
EXPOSE ${PORT:-5173}

# Start Express server (serves dist/ directory)
CMD ["npm", "start"]
