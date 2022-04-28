FROM node:alpine3.15 AS builder

WORKDIR /app

COPY web/package.json ./
COPY web/package-lock.json ./

RUN npm ci --silent
COPY web/ ./
RUN GENERATE_SOURCEMAP=false npm run build

FROM node:alpine3.15

WORKDIR /app

COPY server/package.json ./
COPY server/package-lock.json ./
COPY process.yml ./
COPY --from=builder /app/build ./build

RUN npm ci --silent
RUN npm i -g pm2

COPY server/ ./

ENV PORT 3000
ENV SQL_USER ""
ENV SQL_PASS ""
ENV SQL_HOST ""
ENV SQL_PORT 3306
ENV SQL_DATABASE ""
ENV JWT_SECRET "s3cr3t_k3y"
ENV AIMLAC_RSE_ADDR ""
ENV AIMLAC_RSE_KEY ""

ENTRYPOINT ["pm2-runtime", "process.yml"]