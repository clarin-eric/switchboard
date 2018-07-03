#!/bin/sh

rm -rf build
mkdir -p build/CLRSwitchboard


# Create docker image which builds the code.
# The necessary build environment is supplied by the FROM image registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:1.0.0
docker build --no-cache --tag clarin/switchboard .

EXISTING_CONTAINER=$(docker ps -aq --filter name=alpinelrs-build)
if [ ! -z "${EXISTING_CONTAINER}" ]; then
	docker rm "${EXISTING_CONTAINER}"
fi

# Spin the image so we can use "docker cp"
docker run --name alpinelrs-build clarin/switchboard

docker cp alpinelrs-build:/tmp/lrs/build build/CLRSwitchboard/http
cp -r app/python build/CLRSwitchboard/uwsgi

cd build
tar cvf CLRSwitchboard.tar.gz CLRSwitchboard