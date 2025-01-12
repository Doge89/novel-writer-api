FROM node:22-alpine as base
WORKDIR /app
COPY package*.json .
COPY . .
RUN npm i && npm run build && npm cache clean --force

FROM base as production
WORKDIR /app
COPY --from=base /app/dist .
EXPOSE 3000
ENTRYPOINT ["node", "dist/main"]
