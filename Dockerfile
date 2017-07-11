# Docker image for running CLRS
# C. Zinn, initiated November 2016
# Time-stamp: <2017-07-11 10:39:51 (zinn)>
#
# This is a minimal image for running the CLRS in a DOCKER image.
# This Dockerfile assumes, however, that calls to Apache Tika, and the file storage server
# are handled with external calls, see to-do list below.
#

# start with a docker image that runs java
FROM openjdk:8

# now, install nginx
# the following being taken from the nginx:latest dockerfile
MAINTAINER NGINX Docker Maintainers "docker-maint@nginx.com"

ENV NGINX_VERSION 1.11.5-1~jessie

RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
	&& echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
	&& apt-get update \
	&& apt-get install --no-install-recommends --no-install-suggests -y \
						ca-certificates \
						nginx=${NGINX_VERSION} \
						nginx-module-xslt \
						nginx-module-geoip \
						nginx-module-image-filter \
						nginx-module-perl \
						nginx-module-njs \
						gettext-base \
	&& rm -rf /var/lib/apt/lists/*

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443

# now, we are copying the CLRS build directory to the image
# todo: use release from Github directory
COPY ./build/ /usr/share/nginx/html

# todo: fetch Apache Tika server, plus reverse proxy
# todo: reverse proxy to MPG file storage server
# todo: use supervisord to start/control multiple processes

CMD ["nginx", "-g", "daemon off;"]

