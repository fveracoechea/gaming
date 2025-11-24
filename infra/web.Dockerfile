FROM oven/bun:1.3 AS dependencies-env
RUN ls .
COPY . /app
WORKDIR /app

RUN bun install --frozen-lockfile
RUN bun run web:build

CMD ["bun", "run", "web:start"]
