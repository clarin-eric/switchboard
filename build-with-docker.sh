#!/bin/sh

rm -rf build
mkdir -p build/CLRSwitchboard

docker build --no-cache --tag clarin/switchboard .

EXISTING_CONTAINER=$(docker ps -aq --filter name=alpinelrs-build)
if [ ! -z "${EXISTING_CONTAINER}" ]; then
	docker rm "${EXISTING_CONTAINER}"
fi

docker run --name alpinelrs-build clarin/switchboard

docker cp alpinelrs-build:/tmp/lrs/build build/CLRSwitchboard/http
cp -r app/python build/CLRSwitchboard/uwsgi

tar cvf build/CLRSwitchboard build/CLRSwitchboard.tar.gz 