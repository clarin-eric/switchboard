FROM cypress/browsers:node16.5.0-chrome94-ff93

WORKDIR /build
COPY ./Makefile                 .
COPY ./webui/.babelrc           ./webui/
COPY ./webui/package.json       ./webui/
COPY ./webui/package-lock.json  ./webui/
COPY ./webui/webpack.config.js  ./webui/
COPY ./webui/src                ./webui/src
COPY ./webui/test               ./webui/test

WORKDIR /build/webui
RUN npm i cypress

WORKDIR /build/webui/test
CMD $(npm bin)/cypress run -q -c baseUrl=http://switchboard:8080
