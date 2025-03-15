import { createContext, useState, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import dialogueData from '../data/dialogue.json'

export const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const audioRef = useRef(null)
  const narrationQueue = useRef([])
  const soundsCache = useRef({})

  const playNarration = useCallback(async (dialogueId) => {
    try {
      // Stop current narration if playing
      if (audioRef.current) {
        audioRef.current.stop()
      }

      // Get dialogue data
      const dialogue = dialogueData[dialogueId]
      if (!dialogue) {
        console.warn(`Dialogue ID "${dialogueId}" not found, continuing without audio`)
        return
      }

      // Set current dialogue for UI display
      setCurrentDialogue(dialogue)

      // Create new audio element with error handling
      const audio = new Howl({
        src: [`/audio/narration/${dialogueId}.mp3`],
        html5: true,
        preload: true,
        onload: () => {
          console.log(`Audio loaded: ${dialogueId}`)
        },
        onloaderror: (id, err) => {
          console.warn(`Audio loading error for ${dialogueId}:`, err)
          // Continue with dialogue even if audio fails
          setIsPlaying(false)
          setCurrentDialogue(dialogue)
        },
        onend: () => {
          setIsPlaying(false)
          setCurrentDialogue(null)
          playNextInQueue()
        },
        onplayerror: (id, err) => {
          console.warn(`Audio play error for ${dialogueId}:`, err)
          // Continue with dialogue even if audio fails
          setIsPlaying(false)
          setCurrentDialogue(dialogue)
        }
      })

      audio.play()
      audioRef.current = audio
      setCurrentTrack(dialogueId)
      setIsPlaying(true)

    } catch (err) {
      console.warn('Failed to play audio:', err)
      // Continue with dialogue even if audio fails
      setCurrentDialogue(dialogue)
    }
  }, [])

  const playNextInQueue = useCallback(() => {
    if (narrationQueue.current.length > 0) {
      const nextTrack = narrationQueue.current.shift()
      playNarration(nextTrack)
    }
  }, [playNarration])

  const queueNarration = useCallback((dialogueId) => {
    narrationQueue.current.push(dialogueId)
    
    if (!isPlaying) {
      playNextInQueue()
    }
  }, [isPlaying, playNextInQueue])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop()
      setIsPlaying(false)
      setCurrentTrack(null)
      setCurrentDialogue(null)
    }
  }, [])

  return (
    <AudioContext.Provider value={{
      playNarration,
      queueNarration,
      stopAudio,
      isPlaying,
      currentTrack,
      currentDialogue
    }}>
      {children}
    </AudioContext.Provider>
  )
}
