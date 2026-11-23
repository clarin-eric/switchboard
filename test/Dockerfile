FROM cypress/browsers:node-26.13.1-chrome-157.0.8103.50-1-ff-160.0-edge-157.0.4341.46-1

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
