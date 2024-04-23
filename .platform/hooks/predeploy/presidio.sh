#!/bin/sh

curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user

pip install presidio_analyzer
pip install presidio_anonymizer
python3 -m spacy download en_core_web_lg
