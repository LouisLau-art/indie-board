<script setup lang="ts">
// Una UI handles dark mode automatically
</script>

<template>
  <div class="min-h-screen bg-base text-base transition-colors duration-300">
    <NuxtPage />
  </div>
</template>

<style>
/* Global styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Override fonts with system sans-serif */
html {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--una-gray-300);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--una-gray-600);
}
</style>
