# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# ARG DATABASE_URL
# ENV DATABASE_URL=$DATABASE_URL

# EXPOSE 8000

# # Run drizzle migration THEN start dev server
# CMD npx drizzle-kit push --config ./src/drizzle.config.ts && npm run dev

FROM node:22

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/src
RUN npx drizzle-kit push

EXPOSE 8000
CMD ["npm", "run", "dev"]
