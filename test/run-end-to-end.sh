set -e
#export SWITCHBOARD_TOOLS_REGISTRY_DIR=$1
#if test -z $SWITCHBOARD_TOOLS_REGISTRY_DIR; then
#	echo "Switchboard tools registry directory needed as parameter to this script"
#	exit 1
#fi
#if ! docker volume inspect toolsdata >/dev/null; then 
#    docker volume create toolsdata && \
#    docker run --rm  -w / -v toolsdata:/switchboard-tool-registry alpine/git \
#        clone https://github.com/clarin-eric/switchboard-tool-registry/ --branch production --depth 1
#fi

test -e test/Dockerfile || (echo "This script must be run from the project root" && exit 1)
docker build . -f test/Dockerfile -t switchboard/switchboard-tester

cd test
if docker-compose up --abort-on-container-exit --exit-code-from tester;  then
	docker-compose down
else 
    docker-compose down
    exit 1
fi

