FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

WORKDIR /app

ENV HUSKY 0

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY .husky .husky
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.staging.sample .env
RUN npm run build

ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 8080
ENV PORT 8080

CMD HOSTNAME="0.0.0.0" node dist/main.js
