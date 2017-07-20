# Adapted from clarin-eric/docker-nginx-base
# See https://github.com/clarin-eric/docker-nginx-base/blob/master/Makefile

VERSION="0.9.8"
NAME="clauszinn/switchboard"
REPOSITORY="hub.docker.com"
#IMAGE_NAME="${REPOSITORY}/${NAME}:${VERSION}"
IMAGE_NAME="${NAME}:${VERSION}"

#IMAGE_NAME="clrs"
all: buildImage

buildImage:
	docker build -t ${IMAGE_NAME} -f docker/Dockerfile .

push:
	docker push ${IMAGE_NAME}
