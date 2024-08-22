FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/build/ ./build/

COPY . .

EXPOSE 3000

CMD ["npx", "serve", "-s", "build"]