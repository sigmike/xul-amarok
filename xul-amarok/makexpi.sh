#!/bin/sh

cd extension/chrome

[ -e xul-amarok.jar ] && rm -f xul-amarok.jar

zip -r xul-amarok.jar content locale skin
cd ..

[ -e ../script/xul-amarok.xpi ] && rm -f ../script/xul-amarok.xpi
zip -r ../script/xul-amarok.xpi chrome/xul-amarok.jar components/* install.*
rm -f chrome/xul-amarok.jar
