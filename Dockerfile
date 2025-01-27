FROM oven/bun:1.1.38-alpine AS frontend_build
WORKDIR /frontend
COPY ./src/frontend ./src/frontend
COPY frontend-build.ts package.json bun.lockb .
RUN bun install --frozen-lockfile && bun run build

FROM python:3.12.7 AS release
WORKDIR /app
COPY . .
COPY --from=frontend_build /frontend/src/static/build ./src/static/build
RUN pip install -r requirements.txt

CMD [ "python3", "src/main.py" ]
