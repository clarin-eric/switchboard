FROM cypress/browsers:node-20.14.0-chrome-125.0.6422.141-1-ff-126.0.1-edge-125.0.2535.85-1

WORKDIR /build

COPY ./Makefile                 .
COPY ./webui/.babelrc           ./webui/
COPY ./webui/package.json       ./webui/
COPY ./webui/package-lock.json  ./webui/
COPY ./webui/webpack.config.js  ./webui/
COPY ./webui/src                ./webui/src
COPY ./webui/test               ./webui/test

RUN apt-get update && \
    apt-get install -y \
    make g++

RUN make dev-dependencies

CMD make run-uitests
