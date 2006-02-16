#!/usr/bin/env python

# -*- coding: utf-8 -*-

import sys,os

from AmarokHTTPServer import AmarokHTTPRequestHandler
from BaseHTTPServer import HTTPServer
from Amarok import Amarok
from ConfigParser import SafeConfigParser


def main():
    
    config=SafeConfigParser()
    config.read('xulremote.ini')
    
    httpd = HTTPServer((config.get('Listen','host'),config.getint('Listen','port')), AmarokHTTPRequestHandler)
    httpd.clients = []
    
    httpd.login   = config.get('HttpAuth','login')
    httpd.passwd  = config.get('HttpAuth','passwd')
    httpd.debug   = config.getint('Debug','debugAJAX')

    httpd.amarok = Amarok()
    httpd.amarok.debug = config.getint('Debug','debugDCOP')
    
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()
        print "server closed"

if __name__ == "__main__":
    main()
