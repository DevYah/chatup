#!/bin/bash
 
sudo apt-get -y install git
sudo apt-get -y install nodejs


sudo apt-get install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update

npm install -g forever

#git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle

git clone https://github.com/DevYah/chatup.git 

cd chatup && npm install && nodejs app.js $1
