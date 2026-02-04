<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
// ไม่ต้องมี logic อะไรใน App.vue
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.app {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
