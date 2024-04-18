#!/bin/sh

docker pull mcr.microsoft.com/presidio/presidio-analyzer
docker run -d -p 5001:5001 mcr.microsoft.com/presidio/presidio-analyzer
