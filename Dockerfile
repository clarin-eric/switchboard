FROM registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.3

MAINTAINER andre@clarin.eu

COPY ./Makefile                 /tmp/lrs/

COPY ./webui/.babelrc           /tmp/lrs/webui/
COPY ./webui/copy_files.sh      /tmp/lrs/webui/
COPY ./webui/package.json       /tmp/lrs/webui/
COPY ./webui/package-lock.json  /tmp/lrs/webui/
COPY ./webui/webpack.config.js  /tmp/lrs/webui/
COPY ./webui/src                /tmp/lrs/webui/

WORKDIR /tmp/lrs/
RUN make dependencies && make build-webui-production
