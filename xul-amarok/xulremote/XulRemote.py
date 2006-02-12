#!/usr/bin/env python

# -*- coding: utf-8 -*-

import sys,os

from AmarokHTTPServer import AmarokHTTPRequestHandler
from BaseHTTPServer import HTTPServer
from Amarok import Amarok


# the port number to listen to
PORT = 8888


def main():

    httpd = HTTPServer(('',PORT), AmarokHTTPRequestHandler)
    httpd.clients=[]
    httpd.amarok=Amarok()
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()
        print "server closed"

if __name__ == "__main__":
    main()
