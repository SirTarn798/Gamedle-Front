FROM node:22.14-alpine

RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app

RUN chown -R node:node /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

USER node

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY --chown=node:node . .

ENV NODE_ENV=development

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "dev"]