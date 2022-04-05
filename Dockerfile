FROM node:alpine

RUN mkdir -p node-app-ec-tool && chown -R node:node node-app-ec-tool

WORKDIR node-app-ec-tool

COPY . .

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 6363

CMD ["npm","start"]
