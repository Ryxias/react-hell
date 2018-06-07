#!/bin/bash
#
# This script rsyncs code on local machines to the webserver.
# This project will not work properly unless you setup your ssh config file
#
set -e

# Config
REMOTEUSER=nico

# Use rsync to bring all files from this project
rsync -avr --progress ~/github/chuuni/. $REMOTEUSER@machine.chuuni.me:~/repos/chuuni --exclude .git --exclude .idea --exclude /node_modules
