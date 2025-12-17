<script setup lang="ts">
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  // DaisyUI uses data-theme attribute
  document.documentElement.setAttribute('data-theme', isDark.value ? 'forest' : 'emerald')
}

onMounted(() => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.setAttribute('data-theme', isDark.value ? 'forest' : 'emerald')
})
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
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

/* Override DaisyUI theme fonts with system sans-serif */
html {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  scroll-behavior: smooth;
}

/* Override DaisyUI's --font-sans variable */
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: oklch(var(--bc) / 0.2);
  border-radius: 4px;
}
</style>
