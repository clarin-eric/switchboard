WEBUIAPP=src/main/resources/webui
JSBUNDLE=$(WEBUIAPP)/bundle.js

build-docker-image: build-webui-production
	(cd backend && mvn -q clean package docker:build)

build-webui-production:
	(cd webui && node_modules/webpack/bin/webpack.js --mode production -p)

run-backend:
	(cd backend && mvn -q package && JAVA_OPTS="-Xmx4g" target/appassembler/bin/switchboard server config.yaml)

run-webui-dev-server:
	(cd webui && node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development -d --hot)

dependencies:
	(cd webui && npm install)

clean:
	(cd backend && mvn -q clean)
	rm webui/package-lock.json
	rm -rf webui/node_modules
	rm -f $(WEBUIAPP)/bundle.js*

.PHONY: build-docker-image build-webui-production run-backend run-webui-dev-server dependencies clean
