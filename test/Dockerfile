FROM cypress/browsers:node16.5.0-chrome94-ff93

WORKDIR /build

COPY ./Makefile                 .
COPY ./webui/.babelrc           ./webui/
COPY ./webui/package.json       ./webui/
COPY ./webui/package-lock.json  ./webui/
COPY ./webui/webpack.config.js  ./webui/
COPY ./webui/src                ./webui/src
COPY ./webui/test               ./webui/test

RUN make dependencies

CMD make run-uitests
