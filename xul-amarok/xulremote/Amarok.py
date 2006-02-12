# -*- coding: utf-8 -*-

import sys,os
import string, codecs
import time
from urllib import unquote, quote
#from xml.sax.saxutils import escape

from re import escape

from xml.dom.minidom import parse, parseString

try:
    import pcop
    import pydcop
except:
    os.popen( "kdialog --sorry 'pydcop (DCOP bindings for Python) is required for this script.'" )
    raise

class Amarok:
    
    
    def showMessage(self,msg):
        pydcop.anyAppCalled("amarok").playlist.popupMessage(msg)
        
    #============== PLAYER ==================
    
    def getPosition(self):
        ctime=pydcop.anyAppCalled("amarok").player.trackCurrentTime()
        ttime=pydcop.anyAppCalled("amarok").player.trackTotalTime()
        if ttime > 0 and ctime > 0: return int((100 * ctime) / ttime)
        else: return 0


    def getPlaying(self):
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        pos=self.getPosition()
        return parseString("""<index position="%d">%d</index>""" % (pos,idx))

    
    #main controls
    def play(self):
        pydcop.anyAppCalled("amarok").player.play()
        return self.getPlaying()

    def playByIndex(self,idx):
        pydcop.anyAppCalled("amarok").playlist.playByIndex(int(idx))
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        return parseString("""<index position="0">%d</index>""" % idx)
    
    def stop(self):
        pydcop.anyAppCalled("amarok").player.stop()
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        return parseString("""<index position="0">%d</index>""" % idx)

    def pause(self):
        pydcop.anyAppCalled("amarok").player.playPause()
        return self.getPlaying()

    def next(self):
        pydcop.anyAppCalled("amarok").player.next()
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        return parseString("""<index position="0">%d</index>""" % idx)

    def prev(self):
        pydcop.anyAppCalled("amarok").player.prev()
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        return parseString("""<index position="0">%d</index>""" % idx)
        
    def seek(self,pos):
        pos=int(pos)
        
        idx=pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return parseString("""<index position="0">%d</index>""" % idx)
        
        ttime=pydcop.anyAppCalled("amarok").player.trackTotalTime()
        if ttime > 0: ctime = int(pos * ttime / 100)
        else: ctime=0
        
        #SEEK
        pydcop.anyAppCalled("amarok").player.seek(ctime)

        return parseString("""<index position="%d">%d</index>""" % (pos,idx))

    

    
    
    #volume
    def volumeUp(self):
        pydcop.anyAppCalled("amarok").player.volumeUp()
        vol=pydcop.anyAppCalled("amarok").player.getVolume()
        return parseString("<volume>%d</volume>" % vol)
    
    def volumeDown(self):
        pydcop.anyAppCalled("amarok").player.volumeDown()
        vol=pydcop.anyAppCalled("amarok").player.getVolume()
        return parseString("<volume>%d</volume>" % vol)
        
    def setVolume(self,vol):
        vol=int(float(vol))
        
        pydcop.anyAppCalled("amarok").player.setVolume(vol)
        vol=pydcop.anyAppCalled("amarok").player.getVolume()
        return parseString("<volume>%d</volume>" % vol)
    
    def getVolume(self):
        vol=pydcop.anyAppCalled("amarok").player.getVolume()
        return parseString("<volume>%d</volume>" % vol)
    
    
    
    #============== PLAYLIST ==================
    
    def getPlaylist(self):
        plFile = pydcop.anyAppCalled("amarok").playlist.saveCurrentPlaylist()
        return parse(plFile)
    
    def clearPlaylist(self):
        pydcop.anyAppCalled("amarok").playlist.clearPlaylist()
        return self.getPlaylist()


    


    def addTrack(self,url):
        pydcop.anyAppCalled("amarok").playlist.addMedia(url)



    def addTracks(self,urls):
        for url in urls.split('||'):
            self.addTrack(url)

        time.sleep(0.8)
        return self.getPlaylist()



    def addAlbums(self,albums):
        for album in albums.split('||'):

            urls=[]
            query = """select distinct t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and  al.name = '%s'
                        order by t.track""" % escape(album)
            #print query
            urls=pydcop.anyAppCalled("amarok").collection.query(query)
            for url in urls: self.addTrack(url)
            #pydcop.anyAppCalled("amarok").playlist.addMediaList(urls)
            
        time.sleep(0.8)
        return self.getPlaylist()



    def addArtists(self,artists):
        
        for artist in artists.split('||'):

            urls=[]
            query = """select distinct t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and ar.name = '%s'
                        order by al.name , t.track""" % escape(artist)
            #print query
            urls=pydcop.anyAppCalled("amarok").collection.query(query)
            for url in urls: self.addTrack(url)

        time.sleep(0.8)
        return self.getPlaylist()


    
    #============== COLLECTION ==================
    
    def artists(self,search=''):
        query = """SELECT DISTINCT artist.name 
                       FROM tags INNER JOIN artist ON artist.id=tags.artist  
                       WHERE tags.sampler = 0 """
        if search != '': 
            query += """and artist.name like '%%%s%%'""" % escape(search)
        query += " ORDER BY LOWER( artist.name )"
        
        artists = pydcop.anyAppCalled("amarok").collection.query(query)
        artists.append('Various artists')
        artists.sort(lambda x, y: cmp(string.lower(x), string.lower(y)))
       
        domArtists=parseString("<artists />")
        for artist in artists:
            domArtist=domArtists.createElement('artist')
            content=domArtists.createTextNode(unicode(artist,'utf-8'))
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
                    order by al.name""" % escape(artist)
            #print query
        
        albums = pydcop.anyAppCalled("amarok").collection.query(query)
        
        domAlbums=parseString("<albums />")
        for album in albums:
            domAlbum=domAlbums.createElement('album')
            content=domAlbums.createTextNode(unicode(album,'utf-8'))
            domAlbum.appendChild(content)
            domAlbums.documentElement.appendChild(domAlbum)
        return domAlbums
        
    
    
    def tracks(self,artist,album):
        if artist == 'Various artists':
            query = """SELECT DISTINCT tags.title,tags.url
                        FROM tags INNER JOIN album ON album.id=tags.album INNER JOIN artist ON artist.id=tags.artist INNER JOIN year ON year.id=tags.year 
                        WHERE tags.sampler = 1 AND album.name = '%s'
                        ORDER BY tags.track""" % album
        else:
            query = """select distinct t.title, t.url from album al, artist ar, tags t 
                    where t.artist = ar.id and t.album = al.id 
                        and ar.name = '%s' and al.name = '%s'
                    order by t.track""" % (escape(artist),escape(album))
        #print query
        
        tracks = pydcop.anyAppCalled("amarok").collection.query(query)
        
        domTracks=parseString("<tracks />")
        n=0
        for track in tracks:
            #artist
            if n % 2 == 0:
                domTrack=domTracks.createElement('track')
                content=domTracks.createTextNode(unicode(track,'utf-8'))
                domTrack.appendChild(content)
                domTracks.documentElement.appendChild(domTrack)
            #url
            else:
                domTrack.setAttribute('url',unicode(track,'utf-8'))
            n=n+1
        return domTracks
        
        

        
        
        
