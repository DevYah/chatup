#!/bin/bash
 
sudo apt-get -y install git
sudo apt-get -y install nodejs

#git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle

git clone https://github.com/DevYah/chatup.git 

cd chatup && npm install && nodejs app.js $1
