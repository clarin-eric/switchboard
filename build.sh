#!/bin/sh

NPM_ACTION="i"

if [ "$1" = "ci" ]; then
    NPM_ACTION="ci"
    echo "Running reproducible build using package-lock.json"
fi

cd  "$(dirname -- "$0")"
npm "$NPM_ACTION" dirname
webpack