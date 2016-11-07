# Adapted from clarin-eric/docker-nginx-base
# See https://github.com/clarin-eric/docker-nginx-base/blob/master/Makefile

VERSION="1.0.0"
NAME="clrs"
REPOSITORY="docker.clarin.eu"
IMAGE_NAME="${REPOSITORY}/${NAME}:${VERSION}"

all: build

build:
	docker build -t ${IMAGE_NAME} .

push:
	@docker push ${IMAGE_NAME}
