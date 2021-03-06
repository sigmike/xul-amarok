#!/bin/sh

cd extension/chrome

[ -e xul-amarok.jar ] && rm -f xul-amarok.jar

find content locale skin  -path '*.svn*' -prune -o -print -type f | zip xul-amarok.jar -@

cd ..

[ -e ../xulremote/xul-amarok.xpi ] && rm -f ../xulremote/xul-amarok.xpi

cp chrome.manifest.release chrome.manifest
zip -r ../xulremote/xul-amarok.xpi chrome/xul-amarok.jar defaults/preferences/xul-amarok.js  install.rdf chrome.manifest

rm -f chrome/xul-amarok.jar

cp chrome.manifest.dev chrome.manifest