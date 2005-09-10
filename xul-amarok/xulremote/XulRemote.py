#!/usr/bin/env python
# -*- coding: Latin-1 -*-
import sys,os
import AmarokXMLRPCServer

from Amarok import Amarok


# the port number to listen to
PORT = 8888


def main():

    amarok = Amarok()
    srv = AmarokXMLRPCServer.AmarokXMLRPCServer(('',PORT))
    srv.register_instance(amarok)
    srv.serve_forever()


if __name__ == "__main__":
    main()
