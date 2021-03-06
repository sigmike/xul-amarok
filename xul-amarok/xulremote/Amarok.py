# -*- coding: utf-8 -*-

import sys,os
import string, codecs
import time
from urllib import unquote, quote
import re
from xml.dom.minidom import parse, parseString

debug_prefix = "[XUL remote DCOP ]"

def dbescape(val):
    val=val.replace("'","''") 
    val=val.replace("\"","\\\"")
    return val

class Amarok:
    
    def debug(self, msg):
        if self.debugDCOP: print "%s %s" % (debug_prefix, msg)
        
    def dcopCall(self, interface, method, params=''):

        cmd="dcop amarok %s %s %s" % (interface, method, re.escape(str(params)) )
        self.debug("calling %s" % cmd )
    
        p=os.popen(cmd)
        res=p.read().strip('\n')
        self.debug("=> %s returns %s" % (method, res) )
        try:
            res=int(res)
            return res
        except:
            return res
        
    def showMessage(self,msg):
        self.dcopCall('playlist', 'shortStatusMessage', msg)
        
    #============== PLAYER ==================
    
    def getPosition(self):
        ctime=self.dcopCall('player', 'trackCurrentTime')
        ttime=self.dcopCall('player', 'trackTotalTime')
        if ttime > 0 and ctime > 0: return int((100 * ctime) / ttime)
        else: return 0


    def getPlaying(self):
        idx=self.dcopCall('playlist', 'getActiveIndex')
        pos=self.getPosition()
        return parseString("""<index position="%d">%d</index>""" % (pos,idx))

    
    #main controls
    def play(self):
        self.dcopCall('player', 'play')
        return self.getPlaying()

    def playByIndex(self,idx):
        self.dcopCall('playlist', 'playByIndex', idx)
        return self.getPlaying()
    
    def stop(self):
        self.dcopCall('player', 'stop')
        return self.getPlaying()

    def pause(self):
        self.dcopCall('player', 'playPause')
        return self.getPlaying()

    def next(self):
        self.dcopCall('player', 'next')
        return self.getPlaying()

    def prev(self):
        self.dcopCall('player', 'prev')
        return self.getPlaying()


    def seek(self,pos):
        pos=int(pos)
        
        idx=self.dcopCall('playlist', 'getActiveIndex')
        if self.dcopCall('player', 'isPlaying') == 0:
            return parseString("""<index position="0">%d</index>""" % idx)

        ttime=self.dcopCall('player', 'trackTotalTime')
        if ttime > 0: ctime = int(pos * ttime / 100)
        else: ctime=0
        
        #SEEK
        self.dcopCall('player', 'seek', ctime)
        return parseString("""<index position="%d">%d</index>""" % (pos,idx))

    
    def coverImage(self):
        return self.dcopCall('player', 'coverImage')

    #volume
    def volumeUp(self):
        self.dcopCall('player', 'volumeUp')
        return self.getVolume()
    
    def volumeDown(self):
        self.dcopCall('player', 'volumeDown')
        return self.getVolume()
        
    def setVolume(self,vol):
        vol=int(float(vol))
        
        self.dcopCall('player', 'setVolume', vol)
        return self.getVolume()
    
    def getVolume(self):
        vol=self.dcopCall('player', 'getVolume')
        return parseString("<volume>%d</volume>" % vol)
    
    
    
    #============== PLAYLIST ==================
    
    def getPlaylist(self):
        plFile = self.dcopCall('playlist', 'saveCurrentPlaylist')
        return parse(plFile)
    
    def clearPlaylist(self):
        self.dcopCall('playlist', 'clearPlaylist')
        return self.getPlaylist()



    def addTrack(self,url):
        self.dcopCall('playlist', 'addMedia', url)


    def addTracks(self,urls):
        for url in urls.split('||'):
            self.addTrack(url)

        time.sleep(0.8)
        return self.getPlaylist()


    def deleteTracks(self,ids):
        ids=ids.split('||')

        #start from the last not to offset positions
        ids.sort(lambda x, y: int(y)-int(x))

        for id in ids:
            self.deleteTrack(id)
        return self.getPlaylist()

    def deleteTrack(self,id):
        self.dcopCall('playlist', 'removeByIndex', id)


    #============== COLLECTION ==================
    


    def query(self,query):
        
        self.debug("query: %s" % query)
        pp=os.popen("dcop amarok collection query \"%s\"" % query, 'r')
        results=[]
        for r in pp: 
            r=r.strip('\n')
            if r: results.append(r)
        self.debug("query results: %s" % results)
        return results
    
    def getDevices(self):
        query = "select id, lastmountpoint from devices"
        devices=self.query(query)
        
        n=0
        id=''
        devs={'-1': '/'}
        for val in devices:
            if n%2==0:
                id=val
            else:
               devs[id]=val
            n=n+1
        return devs
                
    
    def addAlbums(self,albums):
        for album in albums.split('||'):
            urls=[]
            query = """select distinct t.deviceid, t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and  al.name = '%s'
                        order by t.track""" % dbescape(album)
            
            urls=self.query(query)
            devices=self.getDevices()
            n=0
            path=''
            for val in urls: 
               
                if n % 2 == 0: path=devices[val]
                else: self.addTrack(path+os.sep+val)
                n=n+1

        time.sleep(0.8)
        return self.getPlaylist()


    def addArtists(self,artists):
        for artist in artists.split('||'):

            urls=[]
            query = """select distinct t.deviceid,t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and ar.name = '%s'
                        order by al.name , t.track""" % dbescape(artist)
            urls=self.query(query)
            
            urls=self.query(query)
            devices=self.getDevices()
            n=0
            path=''
            for val in urls: 
               
                if n % 2 == 0: path=devices[val]
                else:
                    print path+val
                    self.addTrack(path+os.sep+val)
                n=n+1

        time.sleep(0.8)
        return self.getPlaylist()

        
        
    def artists(self,search=''):
        
        query = """SELECT DISTINCT artist.name 
                       FROM tags INNER JOIN artist ON artist.id=tags.artist  
                       WHERE tags.sampler = 0 """
        if search != '': query += """and artist.name like '%%%s%%'""" % dbescape(search)
        query += " ORDER BY LOWER( artist.name )"
        
        artists =self.query(query)
        
        artists.append('Various artists')
        artists.sort(lambda x, y: cmp(string.lower(x), string.lower(y)))
       
        domArtists=parseString("<artists />")
        for artist in artists:
            domArtist=domArtists.createElement('artist')
            try:
                content=domArtists.createTextNode(unicode(artist,sys.getfilesystemencoding()))
            except UnicodeDecodeError, err:
                self.debug("PROBLEM WITH ARTIST TAG %s : ERROR %s" % (artist, err))
                pass
            else:
                domArtist.appendChild(content)
                domArtists.documentElement.appendChild(domArtist)
        return domArtists

   
    def albums(self,artist):

        if artist == 'Various artists':
            query= """SELECT DISTINCT album.name 
                      FROM tags INNER JOIN album ON album.id=tags.album INNER JOIN year ON year.id=tags.year 
                      WHERE tags.sampler = 1  ORDER BY LOWER( album.name )"""
        else:
            query = """select distinct al.name from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id and ar.name = '%s' 
                        order by al.name""" % dbescape(artist)

        albums=self.query(query)
        
        domAlbums=parseString("<albums />")
        for album in albums:
            domAlbum=domAlbums.createElement('album')
            content=domAlbums.createTextNode(unicode(album,sys.getfilesystemencoding()))
            domAlbum.appendChild(content)
            domAlbums.documentElement.appendChild(domAlbum)
        return domAlbums
        


    def tracks(self,artist,album):
        if artist == 'Various artists':
            query = """SELECT DISTINCT tags.title,tags.deviceid, tags.url
                        FROM tags INNER JOIN album ON album.id=tags.album INNER JOIN artist ON artist.id=tags.artist INNER JOIN year ON year.id=tags.year 
                        WHERE tags.sampler = 1 AND album.name = '%s'
                        ORDER BY tags.discnumber, tags.track""" % dbescape(album)
        else:
            query = """select distinct t.title, t.deviceid, t.url from album al, artist ar, tags t 
                    where t.artist = ar.id and t.album = al.id 
                        and ar.name = '%s' and al.name = '%s'
                    order by t.discnumber, t.track""" % (dbescape(artist),dbescape(album))

        tracks=self.query(query)
        devices=self.getDevices()
        
        domTracks=parseString("<tracks />")
        n=0
        path=''
        for track in tracks:
            #artist
            if n % 3 == 0:
                domTrack=domTracks.createElement('track')
                content=domTracks.createTextNode(unicode(track,sys.getfilesystemencoding()))
                domTrack.appendChild(content)
                domTracks.documentElement.appendChild(domTrack)
            #url
            elif (n-1) % 3 == 0 :
                path=devices[track]
            else:
                domTrack.setAttribute('url',unicode(path+os.sep+track,sys.getfilesystemencoding()))
            n=n+1
        return domTracks




if __name__ == "__main__":
    
    #for tests
    a=Amarok()
    pl=a.getPlaylist()
    print pl.toxml('utf-8')

    
    
