#!/bin/bash

sudo apt-get install python3-pip
sudo pip3 install virtualenv 

virtualenv -p python3 backend
source backend/bin/activate
pip install Flask
pip install Flask-PyMongo
pip install Flask-Login

