<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Player } from '../types/game'

const props = defineProps<{
  player: Player
}>()

const store = useGameStore()
const emit = defineEmits<{
  'dice-rolled': []
}>()

interface Die {
  value: number
  isLocked: boolean
}

const dice = ref<Die[]>([
  { value: 1, isLocked: false },
  { value: 1, isLocked: false },
  { value: 1, isLocked: false }
])

const isRolling = ref(false)

const rollDice = async () => {
  if (!props.player.isActive || !store.waitingForDiceRoll) return

  isRolling.value = true
  
  // Animation de roulement rapide
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 50))
    dice.value = dice.value.map(die => ({
      ...die,
      value: die.isLocked ? die.value : Math.floor(Math.random() * 6) + 1
    }))
  }

  // Résultat final
  dice.value = dice.value.map(die => ({
    ...die,
    value: die.isLocked ? die.value : Math.floor(Math.random() * 6) + 1
  }))

  isRolling.value = false
  
  const total = dice.value.reduce((sum, die) => sum + die.value, 0)
  store.handleDiceRoll(total)
  emit('dice-rolled')
}

const getDieFace = (value: number) => {
  switch (value) {
    case 1: return '⚀'
    case 2: return '⚁'
    case 3: return '⚂'
    case 4: return '⚃'
    case 5: return '⚄'
    case 6: return '⚅'
    default: return '⚀'
  }
}
</script>

<template>
  <div class="player-card" 
       :class="{ 
         'active': player.isActive,
         'waiting-roll': player.isActive && store.waitingForDiceRoll 
       }"
       :style="{ borderColor: player.color }">
    <div class="player-header" :style="{ backgroundColor: player.color }">
      <h3>Joueur {{ player.id }}</h3>
    </div>
    
    <div class="dice-container">
      <div v-for="(die, index) in dice" 
           :key="index" 
           class="die"
           :class="{ 
             locked: die.isLocked,
             rolling: isRolling && !die.isLocked
           }"
           @click="die.isLocked = !die.isLocked">
        <span class="die-value">{{ getDieFace(die.value) }}</span>
        <span class="die-number">{{ die.value }}</span>
      </div>
    </div>

    <div class="dice-total" v-if="player.isActive && store.waitingForDiceRoll">
      Total: {{ dice.reduce((sum, die) => sum + die.value, 0) }}
    </div>
    
    <button 
      class="roll-button" 
      :style="{ 
        backgroundColor: player.color,
        opacity: (!player.isActive || !store.waitingForDiceRoll || isRolling) ? 0.5 : 1 
      }"
      :disabled="!player.isActive || !store.waitingForDiceRoll || isRolling"
      @click="rollDice"
    >
      🎲 Lancer
    </button>
  </div>
</template>

<style scoped>
.player-card {
  background-color: #34495e;
  border-radius: 8px;
  border: 2px solid;
  width: 160px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.player-header {
  padding: 0.5rem;
  color: white;
}

.player-header h3 {
  margin: 0;
  font-size: 1rem;
}

.dice-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.die {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.die-value {
  font-size: 1.8rem;
  line-height: 1;
}

.die-number {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.8rem;
  color: #666;
}

.die.rolling {
  animation: shake 0.5s infinite;
}

.die.locked {
  background-color: #ddd;
  border: 2px solid #666;
}

.die.locked .die-value,
.die.locked .die-number {
  opacity: 0.6;
}

.dice-total {
  margin: 0.5rem 0;
  font-weight: bold;
  color: white;
}

@keyframes shake {
  0% { transform: rotate(-10deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(-10deg); }
}

.roll-button {
  width: auto;
  padding: 0.5rem 1rem;
  margin: 0.5rem auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.player-card.active {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.waiting-roll {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style> 