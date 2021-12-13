set -e

test -e test/Dockerfile || (echo "This script must be run from the project root" && exit 1)
docker build . -f test/Dockerfile -t switchboard/switchboard-tester

cd test
if docker-compose up --abort-on-container-exit --exit-code-from tester;  then
	docker-compose down
else 
    docker-compose down
    exit 1
fi

