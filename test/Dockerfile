FROM cypress/browsers:node18.12.0-chrome107

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
