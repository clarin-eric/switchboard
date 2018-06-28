#!/bin/sh

rm -rf target
mkdir -p target/CLRSwitchboard

docker build --no-cache --tag clarin/switchboard .

EXISTING_CONTAINER=$(docker ps -aq --filter name=alpinelrs-build)
if [ ! -z "${EXISTING_CONTAINER}" ]; then
	docker rm "${EXISTING_CONTAINER}"
fi

docker run --name alpinelrs-build clarin/switchboard

docker cp alpinelrs-build:/tmp/lrs/build target/CLRSwitchboard/http
cp -r app/python target/CLRSwitchboard/uwsgi