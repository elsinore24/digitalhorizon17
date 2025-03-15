import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../../hooks/useGameState'
import useAudio from '../../hooks/useAudio'
import TemporalEcho from '../../components/TemporalEcho'
import Scene3D from '../../components/Scene3D'
import DialogueBox from '../../components/DialogueBox'
import DataPerceptionOverlay from '../../components/DataPerceptionOverlay'
import ObjectiveTracker from '../../components/ObjectiveTracker'
import DialogueSystem from '../../components/DialogueSystem'
import styles from './LunarArrival.module.scss'

const INTRO_DIALOGUE = [
  {
    id: 'lunar_arrival_intro',
    speaker: 'ALARA',
    text: "Professor Thorne? Can you hear me? Your neural connection is stabilizing... There you are. The transfer was rougher than anticipated. Your consciousness has been projected into this data construct while your physical form remains in stasis back at the institute. I'm ALARA - Advanced Linguistic Analysis and Retrieval Algorithm. I've been tasked with guiding you through these forgotten data fragments.",
    duration: 8000
  },
  {
    id: 'lunar_arrival_explanation',
    speaker: 'ALARA',
    text: "You're experiencing the lunar surface as it existed in 2089, just before the Temporal Collapse. These are echoes, Professor - memories preserved in quantum data fields. Someone left something here. Something they didn't want forgotten.",
    duration: 6000
  },
  {
    id: 'lunar_arrival_details',
    speaker: 'ALARA',
    text: "The neural mapping shows signs of deliberate encoding... personal imprints. I detect residual patterns similar to those we found in Dr. Kai's final transmission. The resemblance is... statistically improbable.",
    duration: 6000
  },
  {
    id: 'lunar_arrival_instructions',
    speaker: 'ALARA',
    text: "Your neural stability is holding at 94% - remarkable considering the circumstances. Use the Data Perception toggle to shift between physical and digital realities. What appears solid may be ephemeral, and what seems absent may simply be waiting for the right perception.",
    duration: 7000
  },
  {
    id: 'lunar_arrival_urgency',
    speaker: 'ALARA',
    text: "We don't have much time. The neural connection will degrade eventually. Find the fragments, Professor. Find what Dr. Kai left behind before his consciousness scattered across the datascape. Before grief became the only pattern we could recognize.",
    duration: 7000
  }
]

const LunarArrival = ({ dataPerceptionMode }) => {
  const { gameState, visitScene } = useGameState()
  const { playNarration } = useAudio()
  const [introStep, setIntroStep] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const isFirstVisit = !gameState.scenesVisited.includes('lunar_arrival')
    if (isFirstVisit) {
      playIntroSequence()
      visitScene('lunar_arrival')
    }
  }, [gameState.scenesVisited, visitScene])

  const playIntroSequence = async () => {
    setIsPlaying(true)
    for (let i = 0; i < INTRO_DIALOGUE.length; i++) {
      const dialogue = INTRO_DIALOGUE[i]
      await new Promise(resolve => {
        playNarration(dialogue.id)
        setTimeout(resolve, dialogue.duration)
      })
      setIntroStep(i + 1)
    }
    setIntroComplete(true)
    setIsPlaying(false)
  }

  return (
    <div className={styles.sceneContainer}>
      <div className={styles.lunarSurface}>
        <div className={styles.stars} />
        <div className={styles.horizon} />
        <div className={styles.lunarGround} />
      </div>

      <Scene3D dataPerceptionMode={dataPerceptionMode} />
      <DataPerceptionOverlay active={dataPerceptionMode} />
      
      <ObjectiveTracker 
        objective="DR. KAI'S RESEARCH FRGM"
        progress={{
          RESEARCH_LOG: gameState.discoveredEchoes.filter(id => id.startsWith('research_')).length,
          PERSONAL_MEMORY: gameState.discoveredEchoes.filter(id => id.startsWith('memory_')).length,
          ANOMALY: gameState.discoveredEchoes.filter(id => id.startsWith('anomaly_')).length
        }}
      />
      
      <div className={styles.environment}>
        {dataPerceptionMode && (
          <div className={styles.dataElements}>
            <TemporalEcho 
              id="research_001"
              type="RESEARCH_LOG"
              position={{ x: 25, y: 40 }}
            />
            <TemporalEcho 
              id="memory_001"
              type="PERSONAL_MEMORY"
              position={{ x: 75, y: 60 }}
            />
            <TemporalEcho 
              id="anomaly_001"
              type="ANOMALY"
              position={{ x: 50, y: 30 }}
            />
          </div>
        )}

        <AnimatePresence>
          {!introComplete && INTRO_DIALOGUE[introStep] && (
            <motion.div 
              className={styles.introSequence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogueBox
                dialogue={INTRO_DIALOGUE[introStep]}
                onComplete={() => {
                  if (introStep < INTRO_DIALOGUE.length - 1) {
                    setIntroStep(prev => prev + 1)
                  } else {
                    setIntroComplete(true)
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DialogueSystem />
    </div>
  )
}

export default LunarArrival
