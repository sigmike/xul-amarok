# -*- coding: utf-8 -*-

import sys, os, shutil

from BaseHTTPServer import BaseHTTPRequestHandler
import cgi, socket
from xml.dom.minidom import parseString

import inspect

class AmarokHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        
        
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
            
            
        else:
        
        
            """Serve  the extension"""
            try:
                f = open(sys.path[0]+os.sep+"xul-amarok.xpi", "r")
            except IOError:
                self.send_error(404, "File not found")
                return None
    
            (host, port) = self.client_address
            (hostname, aliaslist, ipaddrlist) = socket.gethostbyaddr(host)
            self.server.amarok.showMessage('XUL remote: Firefox extension install from %s' % hostname)
            
            self.send_response(200)
            self.send_header("Content-type", "application/x-xpinstall")
            self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
            self.end_headers()
            shutil.copyfileobj(f, self.wfile)
            f.close()


    def do_POST(self):
        
        (host, port) = self.client_address
        if host not in self.server.clients:
            (hostname, aliaslist, ipaddrlist) = socket.gethostbyaddr(host)
            self.server.amarok.showMessage('XUL remote: New connexion from %s' % hostname)
            self.server.clients.append(host)
        
        self.query = self.rfile.read(int(self.headers['Content-Length']))
        self.args = dict(cgi.parse_qsl(self.query))
        
        method=self.args['method']
        del self.args['method']

        if method in dir(self.server.amarok) and callable(getattr(self.server.amarok, method)):

            try:
                params=[]
                for key in inspect.getargspec(getattr(self.server.amarok, method))[0]:
                    if key != 'self':
                        if key in self.args: params.append(self.args[key])
                        else : params.append('')

                #execution
                response=getattr(self.server.amarok, method)(*params)
                
            except UnicodeDecodeError, err:
                errmsg="UnicodeDecodeError: %s" % err
                self.send_error(500, errmsg)
                print errmsg
                raise
            except RuntimeError, err:
                errmsg="RuntimeError: %s" % err
                self.send_error(500, errmsg)
                print errmsg
                raise
            except:
                errmsg = "Unexpected error: %s " % sys.exc_info()[0]
                print errmsg
                self.send_error(500, errmsg)
                raise

            else:
                dom = parseString('<response><method>%s</method></response>' % method )
                responseElmt = dom.documentElement
                if response: responseElmt.appendChild(response.documentElement)

                self.send_response(200, 'OK')
                self.send_header('Content-type', 'application/xml')
                self.end_headers()
                
                #print(dom.toxml('utf-8'))
                self.wfile.write(dom.toxml('utf-8'))
            
            
        else:
            self.send_error(500, 'method not callable')
            print 'method not callable'



        