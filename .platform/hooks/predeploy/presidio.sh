#!/bin/sh

echo Installing pip

curl -O https://bootstrap.pypa.io/get-pip.py
sudo python3 get-pip.py

df -h > disk_space_before.txt


echo Installing presidio_analyzer

pip install presidio_analyzer

df -h > disk_space_after_presidio_analyzer.txt


echo Installing presidio_anonymizer

pip install presidio_anonymizer

df -h > disk_space_after_presidio_anonymizer.txt


echo download en_core_web_lg

python3 -m spacy download en_core_web_lg

df -h > disk_space_after_spacy_model.txt
