FROM node:26-alpine3.23

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
