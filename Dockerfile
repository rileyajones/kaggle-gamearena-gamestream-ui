FROM node

RUN mkdir /gamestream

COPY . /gamestream

WORKDIR /gamestream

RUN /bin/bash build-prod.sh

ENV NODE_ENV=prod

CMD cd server/dist && node index.js
