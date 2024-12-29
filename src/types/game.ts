export interface Resource {
  name: string
  current: number
  max: number
}

export interface Player {
  id: number
  position: string
  color: string
  isActive: boolean
}

export interface GameState {
  currentDay: number
  timeSlots: boolean[]
  isNight: boolean
  currentTimeSlot: number
  activePlayerId: number | null
  canMove: boolean
}

export interface Card {
  name: string
  type: string
} 