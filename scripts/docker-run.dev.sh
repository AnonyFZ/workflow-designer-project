#!/bin/sh
# remove old
docker-compose -f docker/docker-compose.dev.yml down && \

# rebuild image
docker-compose -f docker/docker-compose.dev.yml build && \
docker-compose -f docker/docker-compose.dev.yml up
