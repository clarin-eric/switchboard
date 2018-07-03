FROM registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.0

MAINTAINER andre@clarin.eu

COPY ./build.sh /tmp/lrs/build.sh
RUN chmod +x /tmp/lrs/build.sh
COPY /package.json /tmp/lrs/package.json
COPY /package-lock.json /tmp/lrs/package-lock.json
COPY /webpack.config.js /tmp/lrs/webpack.config.js
COPY /app /tmp/lrs/app

WORKDIR /tmp/lrs/
RUN /tmp/lrs/build.sh ci
