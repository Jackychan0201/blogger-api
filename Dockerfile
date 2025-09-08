# builder stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# install deps
COPY package*.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# runtime stage
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# only install production deps
COPY package*.json ./
RUN npm ci --production

# copy build output
COPY --from=builder /usr/src/app/dist ./dist

# copy any view/static files if needed (optional)
# COPY --from=builder /usr/src/app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

# start the compiled app
CMD ["node", "dist/main.js"]
