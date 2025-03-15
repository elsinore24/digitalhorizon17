import { create } from 'zustand'

const useGameState = create((set) => ({
  gameState: {
    currentScene: 'LunarArrival',
    dataPerceptionActive: false,
    player: {
      stabilityMeter: 100
    },
    discoveredEchoes: [],
    scenesVisited: []
  },

  updateGameState: (updates) => set((state) => ({
    gameState: {
      ...state.gameState,
      ...updates,
      player: {
        ...state.gameState.player,
        ...(updates.player || {})
      }
    }
  })),

  visitScene: (sceneId) => set((state) => ({
    gameState: {
      ...state.gameState,
      scenesVisited: [...state.gameState.scenesVisited, sceneId]
    }
  })),

  toggleDataPerception: () => set((state) => ({
    gameState: {
      ...state.gameState,
      dataPerceptionActive: !state.gameState.dataPerceptionActive
    }
  }))
}))

export default useGameState
