import { useEffect, useState } from 'react'
import useAudio from '../hooks/useAudio'
import styles from './DialogueDisplay.module.scss'

export default function DialogueDisplay() {
  const { currentDialogue, isPlaying } = useAudio()
  const [displayText, setDisplayText] = useState('')
  const [showingFullText, setShowingFullText] = useState(false)
  
  useEffect(() => {
    if (!currentDialogue) {
      setDisplayText('')
      setShowingFullText(false)
      return
    }
    
    setDisplayText('')
    setShowingFullText(false)
    
    let index = 0
    const textRevealSpeed = 50 // Slower typing speed for glitch effect
    
    const interval = setInterval(() => {
      if (index < currentDialogue.text.length) {
        setDisplayText(prev => prev + currentDialogue.text.charAt(index))
        index++
      } else {
        clearInterval(interval)
        setShowingFullText(true)
      }
    }, textRevealSpeed)
    
    return () => clearInterval(interval)
  }, [currentDialogue])
  
  if (!currentDialogue || !isPlaying) return null
  
  return (
    <div className={styles.dialogueContainer}>
      <div className={styles.dialogueBox}>
        <div className={styles.speakerName}>
          {currentDialogue.speaker}
          <span className={styles.dot}></span>
        </div>
        <p className={styles.dialogueText}>{displayText}</p>
      </div>
    </div>
  )
}
