#!/usr/bin/env python
# -*- coding: Latin-1 -*-


import pcop
import pydcop


class Amarok:
    def getPlaylist(self):
        plFile = pydcop.anyAppCalled("amarok").playlist.saveCurrentPlaylist()
        return file(plFile,"r").read()

    def play(self):
        pydcop.anyAppCalled("amarok").player.play()
        return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def playByIndex(self,idx):
        pydcop.anyAppCalled("amarok").playlist.playByIndex(idx)
        return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def stop(self):
        pydcop.anyAppCalled("amarok").player.stop()
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return "stopped"
        else:
            return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def pause(self):
        pydcop.anyAppCalled("amarok").player.playPause()
        if pydcop.anyAppCalled("amarok").player.isPlaying() == 0:
            return "Paused"
        else:
            return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def next(self):
        pydcop.anyAppCalled("amarok").player.next()
        return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def prev(self):
        pydcop.anyAppCalled("amarok").player.prev()
        return pydcop.anyAppCalled("amarok").player.nowPlaying()

    def volumeUp(self):
        pydcop.anyAppCalled("amarok").player.volumeUp()
        return pydcop.anyAppCalled("amarok").player.getVolume()
    
    def volumeDown(self):
        pydcop.anyAppCalled("amarok").player.volumeDown()
        return pydcop.anyAppCalled("amarok").player.getVolume()
    
    
    def artists(self,search):
        query = """select distinct ar.name from artist ar, tags t 
        				where t.artist = ar.id and ar.name like '%%%s%%'
        				order by ar.name""" % search
        				
        print query
        artists = pydcop.anyAppCalled("amarok").collection.query(query)
        return artists
    
    def albums(self,artist):
        query = """select distinct al.name from album al, artist ar, tags t 
        				where t.artist = ar.id and t.album = al.id and ar.name = '%s'
        				order by al.name""" % artist
        print query
        albums = pydcop.anyAppCalled("amarok").collection.query(query)
        return albums
    
    
    def tracks(self,artist,album):
        query = """select distinct t.title from album al, artist ar, tags t 
        				where t.artist = ar.id and t.album = al.id 
        					and ar.name = '%s' and al.name = '%s'
        				order by al.name""" % (artist,album)
        print query
        tracks = pydcop.anyAppCalled("amarok").collection.query(query)
        return tracks
    
    
    
    