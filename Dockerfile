FROM registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.3

MAINTAINER andre@clarin.eu

ENV FILE_STORAGE_USER=dummyu
ENV FILE_STORAGE_TOKEN=dummyp

COPY ./build.sh /tmp/lrs/build.sh
COPY /package.json /tmp/lrs/package.json
COPY /package-lock.json /tmp/lrs/package-lock.json
COPY /webpack.config.js /tmp/lrs/webpack.config.js
COPY /.babelrc /tmp/lrs/.babelrc
COPY /app /tmp/lrs/app

WORKDIR /tmp/lrs/
RUN sh /tmp/lrs/build.sh ci
