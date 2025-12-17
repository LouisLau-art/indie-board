<script setup lang="ts">
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <button
    class="btn-ghost p-2 rounded-full"
    aria-label="切换主题"
    @click="toggleTheme"
  >
    <span
      :class="isDark ? 'i-carbon-sun' : 'i-carbon-moon'"
      class="text-xl"
    ></span>
  </button>
</template>
