#!/bin/sh

cd extension/chrome

[ -e xum-amarok.jar ] && rm -f xum-amarok.jar

zip -r xum-amarok.jar content locale skin
cd ..

[ -e ../script/xul-amarok.xpi ] && rm -f ../script/xul-amarok.xpi
zip -r ../script/xul-amarok.xpi chrome/xum-amarok.jar components/* install.*