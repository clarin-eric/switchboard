FROM registry.gitlab.com/clarin-eric/docker-alpine-base:1.1.0

MAINTAINER andre@clarin.eu

# Build LRS files for wsgi and http servers
RUN apk update \
    && apk add --upgrade --no-cache nodejs \ 
    && npm ci \
    && webpack
