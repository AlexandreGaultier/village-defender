<script setup lang="ts">
import { ref } from 'vue'
import type { Player } from '../types/game'

const props = defineProps<{
  player: Player
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

const rollDice = () => {
  dice.value = dice.value.map(die => ({
    ...die,
    value: die.isLocked ? die.value : Math.floor(Math.random() * 6) + 1
  }))
}
</script>

<template>
  <div class="player-card" 
       :class="{ 'active': player.isActive }"
       :style="{ borderColor: player.color }">
    <div class="player-header" :style="{ backgroundColor: player.color }">
      <h3>Joueur {{ player.id }}</h3>
    </div>
    <div class="dice-container">
      <div v-for="(die, index) in dice" 
           :key="index" 
           class="die"
           :class="{ locked: die.isLocked }"
           @click="die.isLocked = !die.isLocked">
        {{ die.value }}
      </div>
    </div>
    <button 
      class="roll-button" 
      :style="{ backgroundColor: player.color }"
      @click="rollDice"
    >
      🎲
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
  width: 35px;
  height: 35px;
  background-color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.die:hover {
  transform: translateY(-2px);
}

.die.locked {
  background-color: #ddd;
  border: 2px solid #666;
}

.roll-button {
  width: 35px;
  height: 35px;
  margin: 1rem;
  display:flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: 1.2rem;
}

.roll-button:hover {
  transform: scale(1.1);
}

.player-card.active {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}
</style> 