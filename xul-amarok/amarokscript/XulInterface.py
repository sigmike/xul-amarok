#!/usr/bin/env python
# -*- coding: Latin-1 -*-
import sys,os
import DocXMLRPCServer

from Amarok import Amarok


# the port number to listen to
PORT = 8888


def main():

    amarok = Amarok()
    srv = DocXMLRPCServer.DocXMLRPCServer(('',PORT))
    srv.register_instance(amarok)
    os.system("kdialog --msgbox 'started'")
    srv.serve_forever()


if __name__ == "__main__":
    main()

