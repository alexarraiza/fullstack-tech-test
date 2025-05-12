FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN rm -rf node_modules && npm install --frozen-lockfile
EXPOSE 3000
CMD ["npm", "run", "start:dev"]