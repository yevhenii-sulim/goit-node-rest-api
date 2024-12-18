FROM node
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "server.js"]
