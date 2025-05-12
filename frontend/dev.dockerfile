FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN rm -rf node_modules && npm install --frozen-lockfile
EXPOSE 5173
CMD ["npm", "run", "dev"]