#!/bin/sh

docker pull registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.0

rm -rf build node_modules

EXISTING_CONTAINER=$(docker ps -aq --filter name=alpinelrs-build)
if [ ! -z "${EXISTING_CONTAINER}" ]; then
	docker rm "${EXISTING_CONTAINER}"
fi

docker run --entrypoint sh --name alpinelrs-build --volume "$(pwd)":/tmp/lrs registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.0 /tmp/lrs/build-ci.sh
