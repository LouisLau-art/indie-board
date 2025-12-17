<script setup lang="ts">
import type { Product } from '~/server/database/schema'

// Reactive Props Destructure (Vue 3.5+)
const { product } = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  vote: [id: number]
}>()

// Loading state for vote button
const isVoting = ref(false)
const voteError = ref('')
const hasVoted = ref(false)

async function handleVote() {
  if (isVoting.value || hasVoted.value) return

  isVoting.value = true
  voteError.value = ''

  try {
    await $fetch(`/api/products/${product.id}/vote`, {
      method: 'POST',
    })
    hasVoted.value = true
    emit('vote', product.id)
  } catch (error: any) {
    if (error.statusCode === 429) {
      voteError.value = '今天已投过票啦~'
      hasVoted.value = true
    } else {
      voteError.value = '投票失败，请重试'
    }
  } finally {
    isVoting.value = false
  }
}

// Format date
const formattedDate = computed(() => {
  const date = new Date(product.createdAt)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
})

// Extract domain from URL
const domain = computed(() => {
  try {
    return new URL(product.url).hostname.replace('www.', '')
  } catch {
    return product.url
  }
})
</script>

<template>
  <article class="card transition-all duration-300 hover:scale-102 hover:shadow-xl">
    <div class="flex items-center gap-4">
      <!-- Vote Button -->
      <button
        :class="hasVoted ? 'btn-success' : 'btn-default'"
        class="flex flex-col items-center min-w-16 h-auto py-3"
        :disabled="isVoting || hasVoted"
        @click="handleVote"
      >
        <span v-if="isVoting" class="i-carbon-circle-dash animate-spin text-xl"></span>
        <span v-else :class="hasVoted ? 'i-carbon-checkmark-filled' : 'i-carbon-arrow-up'" class="text-xl"></span>
        <span class="font-bold text-lg mt-1">{{ product.votes }}</span>
      </button>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <span class="font-bold text-lg truncate">{{ product.title }}</span>
          <span class="i-carbon-launch text-sm opacity-50 hover:opacity-100 transition-opacity"></span>
        </a>
        <div class="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <span class="i-carbon-link"></span>
            {{ domain }}
          </span>
          <span class="flex items-center gap-1">
            <span class="i-carbon-calendar"></span>
            {{ formattedDate }}
          </span>
        </div>
        <!-- Vote Error Message -->
        <div v-if="voteError" class="alert-warning mt-2">
          {{ voteError }}
        </div>
      </div>
    </div>
  </article>
</template>
