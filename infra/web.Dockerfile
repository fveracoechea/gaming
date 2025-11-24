FROM oven/bun:1.3 AS dependencies-env
COPY . /app
WORKDIR /app

RUN bun install --frozen-lockfile
RUN bun run web:build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "run", "web:start"]
