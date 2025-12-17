<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <UButton
    variant="ghost"
    icon
    @click="toggleTheme"
  >
    <UIcon
      :name="isDark ? 'i-carbon-sun' : 'i-carbon-moon'"
      class="text-xl"
    />
  </UButton>
</template>
