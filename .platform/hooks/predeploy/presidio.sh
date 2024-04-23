#!/bin/sh

echo Installing pip

curl -O https://bootstrap.pypa.io/get-pip.py
sudo python3 get-pip.py

echo Installing presidio_analyzer

pip install presidio_analyzer

echo Installing presidio_anonymizer

pip install presidio_anonymizer

echo download en_core_web_lg

python3 -m spacy download en_core_web_lg
