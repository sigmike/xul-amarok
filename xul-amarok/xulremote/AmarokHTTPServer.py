# -*- coding: utf-8 -*-

import sys, os, shutil

from BaseHTTPServer import BaseHTTPRequestHandler
import cgi, socket, httplib
from xml.dom.minidom import parseString
import base64

from BaseHTTPServer import HTTPServer
from Amarok import Amarok
import inspect


debug_prefix = "[XUL remote HTTPD]"


class AmarokHTTPServer(HTTPServer):


    def __init__(self, server_address):
        
        self.clients = []
        self.amarok = Amarok()
        HTTPServer.__init__(self, server_address, AmarokHTTPRequestHandler)


    def serve_forever(self):
        self.stop=False;
        while not self.stop:
            self.handle_request()


    def server_close(self):
        self.stop=True;
        
        #send a fake request to loop serve_forever
        (host,port)=self.server_address
        conn = httplib.HTTPConnection("localhost:"+str(port))
        conn.request("QUIT", "")

    def debug(self, message):
        if self.debugAJAX: print "%s %s" % (debug_prefix, message)



class AmarokHTTPRequestHandler(BaseHTTPRequestHandler):


    def log_message(self, format, *args):
        self.server.debug("%s - - [%s] %s" % (self.address_string(), self.log_date_time_string(), format%args)  )


    def checkAuth(self):

        if not self.server.passwd: return True
        
        if self.headers.has_key('Authorization'):
            (login,passwd)=base64.decodestring(self.headers.getheader('Authorization')[6:]).split(':')
            
            if login == self.server.login and passwd == self.server.passwd: return True
            else: 
                self.send_error(403, 'Permission denied')
                (host,port)=self.client_address
                self.server.debug("AUTHENTICATION FAILURE FROM %s" % host)
                return False

        else:
            """actually not used as the header key is always set by the XUL client"""
            self.send_response(401)
            self.send_header("WWW-Authenticate", "Basic realm=\"amarok\"")
            self.end_headers()
            self.wfile.write("Login required")
            return False




    def do_POST(self):
        
        if not self.checkAuth(): return False

        """notify amarok user for a new connexion"""
        (host, port) = self.client_address
        if host not in self.server.clients:
            self.server.amarok.showMessage('XUL remote: New connexion from %s' % host)
            self.server.clients.append(host)
        
        """HTTP query parsing"""
        self.query = self.rfile.read(int(self.headers['Content-Length']))
        self.args = dict(cgi.parse_qsl(self.query))
        
        self.server.debug( "<== POST REQUEST %s" % self.query)
        
        method=self.args['method']
        del self.args['method']

        if method not in dir(self.server.amarok) or not callable(getattr(self.server.amarok, method)):
            message='ERROR method %s not callable' % method
            self.send_error(500,message)
            return false
            
    
        try:
            params=[]
            for key in inspect.getargspec(getattr(self.server.amarok, method))[0]:
                if key != 'self':
                    if key in self.args: 
                        param=unicode(self.args[key], 'utf-8')
                        param=param.encode(sys.getfilesystemencoding())
                        params.append(param)
                    else : params.append('')

            """Amarok DCOP call"""
            response=getattr(self.server.amarok, method)(*params)
            
        except UnicodeDecodeError, err:
            errmsg="UnicodeDecodeError: %s" % err
            self.send_error(500, errmsg)
            self.server.debug("==> POST RESPONSE 500 %s" % errmsg)
        except RuntimeError, err:
            errmsg="RuntimeError: %s" % err
            self.send_error(500, errmsg)
            self.server.debug("==> POST RESPONSE 500 %s" % errmsg)
        except:
            errmsg = "Unexpected error, check AmaroK is running "
            self.send_error(500, errmsg)
            self.server.debug("==> POST RESPONSE 500 %s" % errmsg)

        else:
            """build response"""
            dom = parseString('<response><method>%s</method></response>' % method )
            responseElmt = dom.documentElement
            if response: responseElmt.appendChild(response.documentElement)

            self.send_response(200, 'OK')
            self.send_header('Content-type', 'application/xml')
            self.end_headers()
            
            self.server.debug( "==> POST RESPONSE %s" % dom.toxml('utf-8'))
            self.wfile.write(dom.toxml('utf-8'))


    
    def do_GET(self):
        """Serves the extension and covers images"""
        
        self.server.debug( "<== GET REQUEST %s" % self.path)
            
        if self.path== '/image.png':
            imagePath=self.server.amarok.coverImage()
            try:
                f = open(imagePath, "r")
            except IOError:
                self.send_error(404, "File not found")
                return None
            
            self.send_response(200)
            self.send_header("Cache-control", "no-cache")
            self.send_header("Cache-control", "no-store")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            self.send_header("Content-type", "image/png")
            self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
            self.end_headers()
            shutil.copyfileobj(f, self.wfile)
            f.close()
            self.server.debug( "==> GET RESPONSE file %s" % imagePath)
            
        else:
            """Serve  the extension"""
            try:
                file=sys.path[0]+os.sep+"xul-amarok.xpi"
                self.server.debug( "serving extension %s" % file)
                f = open(file, "r")
            except IOError:
                self.send_error(404, "File not found")
                return None
    
            (host, port) = self.client_address
            message = 'XUL remote: Firefox extension install from %s' % host
            self.server.amarok.showMessage(message)
            self.server.debug(message) 
            
            self.send_response(200)
            self.send_header("Content-type", "application/x-xpinstall")
            self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
            self.end_headers()
            shutil.copyfileobj(f, self.wfile)
            f.close()


 
    def do_QUIT(self):
        pass
        
        
