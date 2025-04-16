DOCKERTAG=switchboard/switchboard:latest
WEBUIAPP=src/main/resources/webui
JSBUNDLE=$(WEBUIAPP)/bundle.js
SWITCHBOARD_URL?=http://localhost:8080
NPM_VERSION=11.3.0

build-docker-image:
	@GIT_COMMIT=$(shell git log -1 --pretty=format:"%H"|cut -c1-7) ;\
	GIT_TAG=$(shell git describe --tags --abbrev=0) ;\
	if [ ! -z "$${CI_VERSION}" ]; then\
		VERSION=$${CI_VERSION} ;\
	else\
		VERSION=0.0.0 ;\
		if [ ! -z $${GIT_TAG} ]; then\
			VERSION=$${GIT_TAG} ;\
		fi ;\
		if [ ! -z "$${GIT_COMMIT}" ]; then\
			VERSION=$${VERSION}-$${GIT_COMMIT} ;\
		fi ;\
		VERSION=$${VERSION}-SNAPSHOT ;\
	fi ;\
	echo VERSION=$${VERSION}; \
	docker build --build-arg version=$${VERSION} -t $(DOCKERTAG) . ;

package:
	rm -rf build
	mkdir -p build/switchboard
	EXISTING_CONTAINER=$$(docker ps -aq --filter name=switchboard-build) ;\
	if [ ! -z "$${EXISTING_CONTAINER}" ]; then \
		docker rm "$${EXISTING_CONTAINER}" ;\
	fi
	# Spin the image so we can use "docker cp"
	docker run --name switchboard-build --entrypoint "true" $(DOCKERTAG) &&\
	docker cp switchboard-build:/switchboard build/
	(cd build && tar cvf switchboard.tar.gz switchboard)

build-webui-production:
	(cd webui && node_modules/webpack/bin/webpack.js --mode production)

run-backend:
	(cd backend && mvn -q package && JAVA_OPTS="-Xmx4g" target/appassembler/bin/switchboard server config.yaml)

run-webui-dev-server:
	(cd webui && node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development)

run-uitests:
	(cd webui/test && ../node_modules/cypress/bin/cypress run -q -c baseUrl=${SWITCHBOARD_URL})

run-interactive-uitests:
	(cd webui/test && ../node_modules/cypress/bin/cypress run --headed -c baseUrl=${SWITCHBOARD_URL})

dependencies:
	(cd webui && npm install -g npm@${NPM_VERSION} && npm install)

dev-dependencies:
	(cd webui && npm install -g npm@${NPM_VERSION} && npm install --save-dev)

clean:
	(cd backend && mvn -q clean)
	rm -rf webui/node_modules
	rm -f $(WEBUIAPP)/bundle.js*

.PHONY: build-docker-image build-webui-production run-backend run-webui-dev-server dependencies dev-dependencies clean
