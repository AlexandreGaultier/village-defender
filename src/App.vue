<script setup lang="ts">
import Board from './components/Board.vue'
</script>

<template>
  <div class="game-container">
    <h1>Village Defenders</h1>
    <Board />
  </div>
</template>

<style scoped>
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>
