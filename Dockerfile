FROM node

RUN mkdir /gamestream

COPY . /gamestream

WORKDIR /gamestream

RUN /bin/bash build-prod.sh

CMD cd server/dist && node index.js
