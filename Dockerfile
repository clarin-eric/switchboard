ARG version

# --- build web ui (js bundles)
FROM registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env:2.4.3 AS webui_builder

# create final location for bundle files
WORKDIR /build/backend/src/main/resources/webui
# set current working dir
WORKDIR /build

COPY ./Makefile                 .

# copy all files from webui, except node_modules
COPY ./webui/.babelrc           ./webui/
COPY ./webui/package.json       ./webui/
COPY ./webui/package-lock.json  ./webui/
COPY ./webui/webpack.config.js  ./webui/
COPY ./webui/src                ./webui/src

RUN make dependencies && make build-webui-production

# --- build java code with maven
FROM registry.gitlab.com/clarin-eric/docker-alpine-supervisor-java-base:openjdk17_jre-1.3.10 AS backend_builder

ARG version
ARG MAVEN_VERSION=3.9.2-r0
ENV SWITCHBOARD_VERSION=$version

RUN apk add maven=${MAVEN_VERSION} openjdk17-jdk=${JAVA_ALPINE_VERSION} openjdk17-jmods=${JAVA_ALPINE_VERSION}

WORKDIR /build
COPY ./.git                     ./.git
COPY ./backend                  ./backend
COPY --from=webui_builder /build/backend/src/main/resources/webui/bundle.js* ./backend/src/main/resources/webui/

WORKDIR /build/backend
RUN mvn versions:set -DnewVersion=${SWITCHBOARD_VERSION}
RUN mvn versions:commit
RUN mvn -q clean package

###############################################################################

# now setup running environment
FROM registry.gitlab.com/clarin-eric/docker-alpine-supervisor-java-base:openjdk17_jre-1.3.10

COPY --from=backend_builder /build/backend/target/appassembler /switchboard/

WORKDIR /switchboard/config
COPY ./backend/tikaConfig.xml  .
COPY ./backend/config.yaml     .

ENTRYPOINT /switchboard/bin/switchboard server config.yaml
