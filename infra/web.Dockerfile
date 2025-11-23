FROM oven/bun:1.3 AS dependencies-env
COPY . /app
WORKDIR /app

RUN bun install --frozen-lockfile
RUN bun run web:build

# production runtime
# FROM oven/bun:1.3 AS production-env
# WORKDIR /app

# Copy the entire monorepo structure to maintain workspace resolution
# COPY --from=dependencies-env /app/package.json ./package.json
# COPY --from=dependencies-env /app/node_modules ./node_modules
# COPY --from=dependencies-env /app/apps/web ./apps/web
# COPY --from=dependencies-env /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production

# Use the npm/bun script to start the server properly
CMD ["bun", "run", "web:start"]
