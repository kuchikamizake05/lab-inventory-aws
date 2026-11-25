FROM node:24-alpine
WORKDIR /app
COPY api.mjs .
USER node
EXPOSE 8080
CMD ["node", "api.mjs"]
