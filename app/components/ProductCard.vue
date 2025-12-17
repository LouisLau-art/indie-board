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
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div class="card-body flex-row items-center gap-4 p-4">
      <!-- Vote Button -->
      <button
        class="btn btn-square btn-lg flex-col h-auto py-2 gap-0"
        :class="hasVoted ? 'btn-success' : 'btn-ghost'"
        :disabled="isVoting || hasVoted"
        @click="handleVote"
      >
        <span v-if="isVoting" class="loading loading-spinner"></span>
        <span v-else :class="hasVoted ? 'i-carbon-checkmark-filled' : 'i-carbon-arrow-up'" class="text-xl"></span>
        <span class="font-bold text-lg">{{ product.votes }}</span>
      </button>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-hover flex items-center gap-2 text-lg font-bold"
        >
          <span class="truncate">{{ product.title }}</span>
          <span class="i-carbon-launch text-sm opacity-50"></span>
        </a>
        <div class="flex items-center gap-3 mt-1 text-sm opacity-60">
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
        <div v-if="voteError" class="alert alert-warning py-1 px-2 mt-2 text-xs">
          <span class="i-carbon-warning"></span>
          <span>{{ voteError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
