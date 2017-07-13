#!/bin//bash

set -e

HELP=0
RUN_TEST=0

#
# Process script arguments
#
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    --test)
    RUN_TEST=1
    ;;
    -h|--help)
    HELP=1
    ;;
    *)
    echo "Unkown option: $key"
    MODE_HELP=1
    ;;
esac
shift # past argument or value
done

#
# Show help message and exit script
#
if [ "${HELP}" -eq 1 ]; then
    echo ""
    echo "entrypoint.sh [args]"
    echo ""
    echo "  --test           Run in test mode. This will automatically shut down when notified about test completion"
    echo ""
    echo "  -h, --help       Show help"
    echo ""
    exit 1
fi

#
# Run script
#
if [ "${RUN_TEST}" -eq 1 ]; then
    echo "Forking check_test.sh"
    check_test.sh "supervisord" &
fi

#
# Initialize configuration
#
if [ -f "/app/init.sh" ]; then
    echo "Initializing"
    . /app/init.sh
else
    echo "Skipping initialization"
fi

#Start supervisor
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf >> /var/log/supervisord/supervisor-startup.log
