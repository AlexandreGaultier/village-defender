<script setup lang="ts">
import { type Resource } from '../types/game'

defineProps<{
  resources: Resource[]
}>()
</script>

<template>
  <div class="resources-panel">
    <div class="resource-gauges">
      <div v-for="resource in resources" :key="resource.name" class="gauge">
        <h4>{{ resource.name }}</h4>
        <div class="gauge-bar">
          <div class="gauge-fill" 
               :style="{ width: `${(resource.current / resource.max) * 100}%` }">
          </div>
        </div>
        <span>{{ resource.current }}/{{ resource.max }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resources-panel {
  background-color: #34495e;
  padding: 1.5rem;
  border-radius: 8px;
}

.resource-gauges {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.gauge {
  flex: 1;
  text-align: center;
  color: white;
}

.gauge-bar {
  width: 100%;
  height: 20px;
  background-color: #2c3e50;
  border-radius: 10px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.gauge-fill {
  height: 100%;
  background-color: #42b883;
  transition: width 0.3s ease;
}

h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}
</style> 