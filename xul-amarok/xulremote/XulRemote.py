#!/usr/bin/env python

# -*- coding: utf-8 -*-

############################################################################
# Python-Qt script for amaroK XUL Remote
# (c) 2006 Matthieu Bedouet <mbedouet@gmail.com>
# (c) 2005 Mark Kretschmann <markey@web.de>
#
# Depends on: Python 2.2, PyQt
############################################################################
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
############################################################################

import ConfigParser
import os
import sys
import threading
import signal
from time import sleep

try:
    from qt import *
except:
    os.popen( "kdialog --sorry 'PyQt (Qt bindings for Python) is required for this script.'" )
    raise

from XULremoteConfigDialog import XULremoteConfigDialog
from AmarokHTTPServer import AmarokHTTPServer


debug_prefix = "[XUL remote]"
configFile='xulremote.ini'

def debug( message ):
    """ Prints debug message to stdout """
    print "%s %s" % (debug_prefix , message)


class ConfigFileError(Exception):

    def __init__(self, message):
        self.message = message



class ConfigDialog( XULremoteConfigDialog ):


    def __init__( self, parent=None ):
        XULremoteConfigDialog.__init__( self, parent )

        try:
            config=ConfigParser.SafeConfigParser()
            config.read(configFile)
            self.interface.setText(config.get('Listen','interface'))
            self.port.setText(config.get('Listen','port'))
            self.login.setText(config.get('HttpAuth','login'))
            self.password.setText(config.get('HttpAuth','passwd'))

        except:
            debug("error reading config, using defaults")
            self.port.setText('8888')



    def accept( self ):
        """ Saves configuration to file """
        try:
            cfile = file( configFile, 'w' )
    
            config = ConfigParser.SafeConfigParser()
            config.add_section( "Listen" )
            config.set( "Listen", "interface", self.interface.text().ascii() )
            config.set( "Listen", "port", self.port.text().ascii() )
            config.add_section( "HttpAuth" )
            config.set( "HttpAuth", "login", self.login.text().ascii() )
            config.set( "HttpAuth", "passwd", self.password.text().ascii() )
            config.add_section( "Debug" )
            config.set( "Debug", "debugAJAX", 0 )
            config.set( "Debug", "debugDCOP", 0 )
            config.write( cfile )
            cfile.close()
            
        except:
            debug("error saving config")
            raise ConfigFileError, "error saving config file"
        
        else:
            debug( configFile+" saved")
            self.emit(PYSIGNAL("configChanged"), ())

        XULremoteConfigDialog.accept(self)



class AmarokHttpdThread(threading.Thread):

    def __init__(self):
        
        threading.Thread.__init__(self)
        try:
            config=ConfigParser.ConfigParser()
            config.read(configFile)
            
            self.interface=config.get('Listen','interface')
            self.port=config.getint('Listen','port')
            self.login=config.get('HttpAuth','login')
            self.passwd=config.get('HttpAuth','passwd')
            self.debugAJAX=config.getint('Debug','debugAJAX')
            self.debugDCOP=config.getint('Debug','debugDCOP')

        except:
            debug("error reading config: won't start HTTPD")
            self.httpd=None
            raise ConfigFileError, "error reading config file"

        self.httpd = AmarokHTTPServer((self.interface,self.port))
        self.httpd.login   = self.login
        self.httpd.passwd  = self.passwd
        self.httpd.debugAJAX = self.debugAJAX
        self.httpd.amarok.debugDCOP = self.debugDCOP

    
    def run (self):
        if self.httpd:
            debug("starting HTTPD")
            self.httpd.serve_forever()

    def stop(self):
        if self.httpd:
            debug("stopping HTTPD")
            self.httpd.server_close()
            self.join()
            self.httpd=None




class Notification( QCustomEvent ):
    __super_init = QCustomEvent.__init__
    def __init__( self, str ):
        self.__super_init(QCustomEvent.User + 1)
        self.string = str



class readStdin(threading.Thread):
    
    def __init__(self, app):
        threading.Thread.__init__(self)
        self.app=app

    def run(self):
        debug("starting readStdin")
        self.running=True
        while self.running:
            # Read data from stdin. Will block until data arrives.
            line = sys.stdin.readline().strip('\n')
            if line: self.app.postEvent( self.app, Notification(line) )

    def stop(self):
        debug("stopping readStdin")
        self.running=False


                
class XULRemote( QApplication ):
    """ The main application, also sets up the Qt event loop """

    def __init__( self, args ):
        QApplication.__init__( self, args )


        # Start separate thread for reading data from stdin
        self.stdinReader=readStdin(self)
        self.stdinReader.start()
        
        self.httpd=None
        self.startHttpd()


    def startHttpd(self):
        
        if self.httpd:
            self.httpd.stop()

        try:
            self.httpd=AmarokHttpdThread()
            self.httpd.start()
            
        except ConfigFileError, msg:
            self.configure()




    # Notification Handling
    def customEvent( self, notification ):
        
        string = QString(notification.string)
        if string.contains( "configure" ):  self.configure()



    def configure(self):
        self.cnf = ConfigDialog()
        self.connect(self.cnf, PYSIGNAL("configChanged"), self.startHttpd)
        self.cnf.show()

    def quit(self):
        debug("shutdown")
        self.stdinReader.stop()
        self.httpd.stop()
        qApp.quit()
        debug("bye")


############################################################################


class MainThead(threading.Thread):
    
    def __init__(self):
        threading.Thread.__init__(self)
        self.setDaemon(True)
        
    def run(self):
        self.app = XULRemote( sys.argv )
        self.app.exec_loop()

    def exit(self,signum,sigframe):
        self.app.quit()
        sys.exit(signum)


if __name__ == "__main__":

    appthread=MainThead()
    appthread.start()
    signal.signal(signal.SIGTERM, appthread.exit)
    
    try:
        while 1: sleep(120)
    except KeyboardInterrupt:
        appthread.app.quit()

