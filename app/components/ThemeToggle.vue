<script setup lang="ts">
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'forest' : 'emerald')
}

onMounted(() => {
  isDark.value = document.documentElement.getAttribute('data-theme') === 'forest'
})
</script>

<template>
  <label class="swap swap-rotate btn btn-ghost btn-circle">
    <input type="checkbox" :checked="isDark" @change="toggleTheme">
    <!-- sun icon -->
    <span class="swap-off i-carbon-sun text-xl"></span>
    <!-- moon icon -->
    <span class="swap-on i-carbon-moon text-xl"></span>
  </label>
</template>
