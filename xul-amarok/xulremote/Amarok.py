
import sys,os
import string
import time
from urllib import unquote
from xml.sax.saxutils import escape

try:
    import pcop
    import pydcop
except:
    os.popen( "kdialog --sorry 'pydcop (DCOP bindings for Python) is required for this script.'" )
    raise

class Amarok:
    
        
        
    #============== PLAYER ==================
    
    #main controls
    def play(self):
        pydcop.anyAppCalled("amarok").player.play()
        return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()

    
    def stop(self):
        pydcop.anyAppCalled("amarok").player.stop()
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return "stopped"
        else:
            return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()

    def pause(self):
        pydcop.anyAppCalled("amarok").player.playPause()
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return "Paused"
        else:
            return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()

    def next(self):
        pydcop.anyAppCalled("amarok").player.next()
        return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()

    def prev(self):
        pydcop.anyAppCalled("amarok").player.prev()
        return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
        
    #seeking
    def seek(self,percent):
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return 0
        
        ttime=pydcop.anyAppCalled("amarok").player.trackTotalTime()
        if ttime > 0:
            ctime = percent * ttime / 100
        pydcop.anyAppCalled("amarok").player.seek(ctime)
        return percent
        
        
    def trackTime(self):
        ctime=pydcop.anyAppCalled("amarok").player.trackCurrentTime()
        ttime=pydcop.anyAppCalled("amarok").player.trackTotalTime()
        if ttime > 0 and ctime > 0:
            return (100 * ctime) / ttime
        else:
            return 0
    
    #volume
    def volumeUp(self):
        pydcop.anyAppCalled("amarok").player.volumeUp()
        return pydcop.anyAppCalled("amarok").player.getVolume()
    
    def volumeDown(self):
        pydcop.anyAppCalled("amarok").player.volumeDown()
        return pydcop.anyAppCalled("amarok").player.getVolume()
        
        
    def setVolume(self,vol):
        pydcop.anyAppCalled("amarok").player.setVolume(vol)
        return vol
    
    def getVolume(self):
        return pydcop.anyAppCalled("amarok").player.getVolume()
    
    
    
    #============== PLAYLIST ==================
    
    def getPlaylist(self):
        plFile = pydcop.anyAppCalled("amarok").playlist.saveCurrentPlaylist()
        return escape(file(plFile,"r").read())
    
    def clearPlaylist(self):
        pydcop.anyAppCalled("amarok").playlist.clearPlaylist()
        return self.getPlaylist()

    def playByIndex(self,idx):
        pydcop.anyAppCalled("amarok").playlist.playByIndex(idx)
        return pydcop.anyAppCalled("amarok").playlist.getActiveIndex()
    
    
    def addMediaList(self,urls):
        #does not work?
        #pydcop.anyAppCalled("amarok").playlist.addMediaList(urls)
        
        #workaround:
        for url in urls:
            pydcop.anyAppCalled("amarok").playlist.addMedia(url)
            
        time.sleep(0.8)
        return self.getPlaylist()


  
    def addAlbums(self,albums):
        urls=[]
        for album in albums:
            query = """select distinct t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and  al.name = '%s'
                        order by t.track""" % (unquote(album))
            urls.extend(pydcop.anyAppCalled("amarok").collection.query(query))
        return self.addMediaList(urls)

    def addArtists(self,artists):
        urls=[]
        for artist in artists:
            query = """select distinct t.url from album al, artist ar, tags t 
                        where t.artist = ar.id and t.album = al.id 
                            and ar.name = '%s'
                        order by al.name , t.track""" % unquote(artist)
            urls.extend(pydcop.anyAppCalled("amarok").collection.query(query))
        return self.addMediaList(urls)

    
    #============== COLLECTION ==================
    
    def artists(self,search):
        query = """SELECT DISTINCT artist.name 
                       FROM tags INNER JOIN artist ON artist.id=tags.artist  
                       WHERE tags.sampler = 0 and artist.name like '%%%s%%'
                       ORDER BY LOWER( artist.name )""" % unquote(search)
        artists = pydcop.anyAppCalled("amarok").collection.query(query)
        artists.append('Various artists')
        artists.sort(lambda x, y: cmp(string.lower(x), string.lower(y)))
        return [escape(artist) for artist in artists]

   
    def albums(self,artist):
        if unquote(artist) == 'Various artists':
            query= """SELECT DISTINCT album.name 
                        FROM tags INNER JOIN album ON album.id=tags.album INNER JOIN year ON year.id=tags.year
                        WHERE tags.sampler = 1  ORDER BY LOWER( album.name )"""
        else:
            query = """select distinct al.name from album al, artist ar, tags t 
                    where t.artist = ar.id and t.album = al.id and ar.name = '%s'
                    order by al.name""" % unquote(artist)

        albums = pydcop.anyAppCalled("amarok").collection.query(query)
        return [escape(album) for album in albums]
    
    
    def tracks(self,artist,album):
        if unquote(artist) == 'Various artists':
            query = """SELECT DISTINCT tags.title,tags.url
                        FROM tags INNER JOIN album ON album.id=tags.album INNER JOIN artist ON artist.id=tags.artist INNER JOIN year ON year.id=tags.year 
                        WHERE tags.sampler = 1 AND album.name = '%s'
                        ORDER BY tags.track""" % unquote(album)
        else:
            query = """select distinct t.title, t.url from album al, artist ar, tags t 
                    where t.artist = ar.id and t.album = al.id 
                        and ar.name = '%s' and al.name = '%s'
                    order by t.track""" % (unquote(artist),unquote(album))
        tracks = pydcop.anyAppCalled("amarok").collection.query(query)
        return [escape(track) for track in tracks]

        
        
        