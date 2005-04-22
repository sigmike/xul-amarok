
import sys, os, shutil

from SimpleXMLRPCServer import SimpleXMLRPCServer,SimpleXMLRPCRequestHandler

class AmarokXMLRPCRequestHandler(SimpleXMLRPCRequestHandler):
   
    def do_GET(self):
        """Serve a GET request."""
        if (self.path == "/"):
            try:
                f = open("xul-amarok.xpi", "r")
            except IOError:
                self.send_error(404, "File not found")
                return None

            self.send_response(200)
            self.send_header("Content-type", "application/x-xpinstall")
            self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
            self.end_headers()
            shutil.copyfileobj(f, self.wfile)
            f.close()
        else:
            self.send_error(404, "File not found")
            return None


class AmarokXMLRPCServer(  SimpleXMLRPCServer ):

    def __init__(self, addr, requestHandler=AmarokXMLRPCRequestHandler,
                 logRequests=1):
        SimpleXMLRPCServer.__init__(self, addr, requestHandler, logRequests)


