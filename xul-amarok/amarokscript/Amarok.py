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
    
    
    def artists(self):
        query = "select distinct name from artist order by name"
        artists = pydcop.anyAppCalled("amarok").collection.query(query)
        return artists
    
    
    
    
    
    
    
    
    
    