<script setup lang="ts">
import { type GameState } from '../types/game'

const props = defineProps<{
  gameState: GameState
}>()

const emit = defineEmits<{
  'evening-council': []
}>()
</script>

<template>
  <div class="turn-indicator">
    <h2>Jour {{ gameState.currentDay }}</h2>
    <div class="time-slots">
      <span v-for="(used, index) in gameState.timeSlots" 
            :key="index"
            :class="{ 'used': used }">
        {{ used ? '🌑' : '☀️' }}
      </span>
    </div>
    <button 
      v-if="gameState.isNight" 
      class="evening-council-btn"
      @click="emit('evening-council')"
    >
      Conseil du Soir 🌙
    </button>
  </div>
</template>

<style scoped>
.turn-indicator {
  background-color: #34495e;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
}

.time-slots {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
}

.time-slots span.used {
  opacity: 0.5;
}

.evening-council-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  border: 2px solid #FFD700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.evening-council-btn:hover {
  background-color: #34495e;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}
</style> 