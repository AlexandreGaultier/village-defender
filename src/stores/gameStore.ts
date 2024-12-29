import { defineStore } from 'pinia'
import type { Resource, Player } from '../types/game'

interface GameStoreState {
  resources: Resource[]
  players: Player[]
  waitingForDiceRoll: boolean
  pendingResource: string | null
}

export const useGameStore = defineStore('game', {
  state: (): GameStoreState => ({
    resources: [
      { name: 'Nourriture', current: 2, max: 10 },
      { name: 'Bois', current: 2, max: 10 },
      { name: 'Pierre', current: 2, max: 10 }
    ],
    players: [],
    waitingForDiceRoll: false,
    pendingResource: null
  }),

  actions: {
    updateResource(resourceName: string, amount: number) {
      const resource = this.resources.find(r => r.name === resourceName)
      if (resource) {
        resource.current = Math.min(resource.current + amount, resource.max)
      }
    },

    handleLocationAction(location: string) {
      switch (location) {
        case 'Forêt':
          this.updateResource('Bois', 1)
          this.waitingForDiceRoll = true
          this.pendingResource = 'Bois'
          break
        case 'Cavernes':
          this.updateResource('Pierre', 1)
          this.waitingForDiceRoll = true
          this.pendingResource = 'Pierre'
          break
        case 'Prairie':
          this.updateResource('Nourriture', 1)
          this.waitingForDiceRoll = true
          this.pendingResource = 'Nourriture'
          break
        default:
          this.waitingForDiceRoll = false
          this.pendingResource = null
      }
    },

    handleDiceRoll(total: number) {
      if (!this.pendingResource) return

      if (total >= 18) {
        this.updateResource(this.pendingResource, 3)
      } else if (total >= 12) {
        this.updateResource(this.pendingResource, 2)
      } else if (total >= 6) {
        this.updateResource(this.pendingResource, 1)
      }

      this.waitingForDiceRoll = false
      this.pendingResource = null
    }
  }
}) 