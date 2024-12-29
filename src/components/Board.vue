<template>
  <div class="game-container">
    <div class="game-layout">
      <div class="players-sidebar">
        <PlayerCard 
          v-for="player in players" 
          :key="player.id" 
          :player="player"
          @dice-rolled="handleDiceRolled"
        />
      </div>
      
      <div class="board">
        <TurnIndicator 
          :game-state="gameState" 
          @evening-council="startEveningCouncil"
        />
        <div class="play-area">
          <div class="village-row">
            <div v-for="card in villageCards" 
                 :key="card.name" 
                 class="card horizontal"
                 @click="movePlayer(card.name)">
              <h3>{{ card.name }}</h3>
              <div class="players-on-card">
                <div v-for="player in players.filter(p => p.position === card.name)"
                     :key="player.id"
                     class="player-token"
                     :class="{ 'active': player.isActive }"
                     :style="{ backgroundColor: player.color }">
                  {{ player.id }}
                </div>
              </div>
            </div>
          </div>

          <div class="resource-row">
            <div v-for="location in resourceLocations" 
                 :key="location.name" 
                 class="card horizontal"
                 @click="movePlayer(location.name)">
              <h3>{{ location.name }}</h3>
              <div class="players-on-card">
                <div v-for="player in players.filter(p => p.position === location.name)"
                     :key="player.id"
                     class="player-token"
                     :class="{ 'active': player.isActive }"
                     :style="{ backgroundColor: player.color }">
                  {{ player.id }}
                </div>
              </div>
            </div>
          </div>

          <div class="event-deck">
            <div class="card vertical">
              <h3>Événements</h3>
            </div>
          </div>
        </div>
        <ResourcePanel :resources="resources" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TurnIndicator from './TurnIndicator.vue'
import ResourcePanel from './ResourcePanel.vue'
import PlayerCard from './PlayerCard.vue'
import type { Resource, Player, GameState, Card } from '../types/game'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
const gameState = ref<GameState>({
  currentDay: 1,
  timeSlots: [false, false, false],
  isNight: false,
  currentTimeSlot: 0,
  activePlayerId: 1,
  canMove: true
})

const players = ref<Player[]>([
  { id: 1, position: 'Mairie', color: '#FF5252', isActive: true },
  { id: 2, position: 'Mairie', color: '#4CAF50', isActive: false },
  { id: 3, position: 'Mairie', color: '#2196F3', isActive: false },
  { id: 4, position: 'Mairie', color: '#FFC107', isActive: false }
])

const resources = ref<Resource[]>([
  { name: 'Nourriture', current: 2, max: 10 },
  { name: 'Bois', current: 2, max: 10 },
  { name: 'Pierre', current: 2, max: 10 }
])

const villageCards: Card[] = [
  { name: 'Mairie', type: 'building' },
  { name: 'Forge', type: 'building' },
  { name: 'Prairie', type: 'building' }
]

const resourceLocations: Card[] = [
  { name: 'Forêt', type: 'resource' },
  { name: 'Cavernes', type: 'resource' }
]

const movePlayer = (cardName: string) => {
  if (!gameState.value.canMove) return
  
  const activePlayer = players.value.find(p => p.id === gameState.value.activePlayerId)
  if (activePlayer) {
    activePlayer.position = cardName
    store.handleLocationAction(cardName)
    
    if (!store.waitingForDiceRoll) {
      nextPlayer()
    }
  }
}

const handleDiceRolled = () => {
  nextPlayer()
}

const nextPlayer = () => {
  const currentPlayerIndex = players.value.findIndex(p => p.id === gameState.value.activePlayerId)
  players.value[currentPlayerIndex].isActive = false
  
  if (currentPlayerIndex === players.value.length - 1) {
    // Tous les joueurs ont joué pour ce temps
    gameState.value.timeSlots[gameState.value.currentTimeSlot] = true
    gameState.value.currentTimeSlot++
    
    if (gameState.value.currentTimeSlot >= 3) {
      // Fin de la journée
      gameState.value.isNight = true
      gameState.value.canMove = false
      return
    }
    
    // Nouveau temps, on recommence avec le premier joueur
    gameState.value.activePlayerId = players.value[0].id
    players.value[0].isActive = true
  } else {
    // Joueur suivant
    gameState.value.activePlayerId = players.value[currentPlayerIndex + 1].id
    players.value[currentPlayerIndex + 1].isActive = true
  }
}

const startEveningCouncil = () => {
  // Réinitialisation pour le prochain jour
  gameState.value.currentDay++
  gameState.value.timeSlots = [false, false, false]
  gameState.value.isNight = false
  gameState.value.currentTimeSlot = 0
  gameState.value.canMove = true
  gameState.value.activePlayerId = players.value[0].id
  
  // Réinitialiser la position des joueurs
  players.value.forEach(player => {
    player.position = 'Mairie'
    player.isActive = player.id === players.value[0].id
  })
}
</script>

<style scoped>
.game-container {
  padding: 2rem;
}

.game-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.players-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 2rem;
}

.board {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: #2c3e50;
  border-radius: 12px;
  min-height: 80vh;
}

.players-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.play-area {
  flex: 1;
  display: grid;
  grid-template-rows: auto auto;
  gap: 2rem;
  margin-right: 200px;
}

.village-row, .resource-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.card {
  background-color: #34495e;
  border-radius: 8px;
  padding: 1rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.horizontal {
  width: 200px;
  height: 150px;
}

.vertical {
  width: 150px;
  height: 200px;
}

.event-deck {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.players-on-card {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.player-token {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.player-token.active {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  border-color: #FFD700;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}
</style> 