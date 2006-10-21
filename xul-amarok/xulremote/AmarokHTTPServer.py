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
        
        #fake request to trigger handle_request
        (host,port)=self.server_address
        if host == '': host='localhost'
        conn = httplib.HTTPConnection(host+":"+str(port))
        conn.request("PING", "/")

    def debug(self, message):
        if self.debugAJAX: print "%s %s" % (debug_prefix, message)
        
    def log(self, message):
         sys.stderr.write("%s %s\n" % (debug_prefix , message))



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

        (host, port) = self.client_address
        
        """check if allowed host"""
        if len(self.server.hosts) and host not in self.server.hosts:
            msg='XUL remote: host %s not allowed' % host
            self.server.log(msg)
            self.server.amarok.showMessage(msg)
            self.send_error(500, msg)
            return False
        
        """notify amarok user for a new connexion"""
        if host not in self.server.clients:
            msg='XUL remote: New connexion from %s' % host
            self.server.log(msg)
            self.server.amarok.showMessage(msg)
            self.server.clients.append(host)
        
        """HTTP query parsing"""
        self.query = self.rfile.read(int(self.headers['Content-Length']))
        self.args = dict(cgi.parse_qsl(self.query))
        
        self.server.debug( "<== POST REQUEST %s" % self.query)
        
        method=self.args['method']
        del self.args['method']

        if method not in dir(self.server.amarok) or not callable(getattr(self.server.amarok, method)):
            msg='method %s does not exist' % method
            self.server.log(msg)
            self.send_error(500,msg)
            return False
            
    
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
            self.server.log(errmsg)
            self.send_error(500, errmsg)
            self.server.debug("==> POST RESPONSE 500 %s" % errmsg)
        except RuntimeError, err:
            errmsg="RuntimeError: %s" % err
            self.server.log(errmsg)
            self.send_error(500, errmsg)
            self.server.debug("==> POST RESPONSE 500 %s" % errmsg)
        #except:
        #    errmsg = "Unexpected error, check AmaroK is running "
        #    self.send_error(500, errmsg)
        #    self.server.debug("==> POST RESPONSE 500 %s" % errmsg)

        else:
            """build response"""
            dom = parseString('<response><method>%s</method></response>' % method )
            responseElmt = dom.documentElement
            if response: responseElmt.appendChild(response.documentElement)

            try: 
                self.send_response(200, 'OK')
                self.send_header('Content-type', 'application/xml')
                self.end_headers()
            
                self.server.debug( "==> POST RESPONSE %s" % dom.toxml('utf-8'))
                self.wfile.write(dom.toxml('utf-8'))
            except:
                print "PROBLEM SENDING RESPONSE to : " + method

    
    def do_GET(self):
        """Serves the extension and covers images"""
        
        self.server.debug( "<== GET REQUEST %s" % self.path)

        (host, port) = self.client_address
        
        if len(self.server.hosts) and host not in self.server.hosts:
            msg='XUL remote: host %s not allowed' % host
            self.server.log(msg)
            self.server.amarok.showMessage(msg)
            self.send_error(500, msg)
            return False
        
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
                f = open(file, "r")
            except IOError:
                self.send_error(404, "File not found")
                return None

            message = 'XUL remote: Firefox extension download from %s' % host
            self.server.log(message)
            self.server.amarok.showMessage(message)
            
            self.send_response(200)
            self.send_header("Content-type", "application/x-xpinstall")
            self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
            self.end_headers()
            shutil.copyfileobj(f, self.wfile)
            f.close()


    def do_PING(self):
        pass
