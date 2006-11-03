#!/bin/sh

./makexpi.sh

rm xulremote/*.pyc xulremote/*.ini

tar cvzf xulremote-x.x.amarokscript.tar.gz xulremote/*


