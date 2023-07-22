FROM node:18

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src /app/src

RUN npm install
RUN npm run build

CMD [ "node", "dist/src/app.js" ]