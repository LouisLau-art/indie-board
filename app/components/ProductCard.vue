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
  <UCard class="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div class="flex items-center gap-4">
      <!-- Vote Button -->
      <UButton
        :color="hasVoted ? 'success' : 'gray'"
        :loading="isVoting"
        :disabled="hasVoted"
        variant="soft"
        class="flex flex-col items-center min-w-16 h-auto py-3 gap-0"
        @click="handleVote"
      >
        <UIcon :name="hasVoted ? 'i-carbon-checkmark-filled' : 'i-carbon-arrow-up'" class="text-xl" />
        <span class="font-bold text-lg">{{ product.votes }}</span>
      </UButton>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <span class="font-bold text-lg truncate">{{ product.title }}</span>
          <UIcon name="i-carbon-launch" class="text-sm opacity-50" />
        </a>
        <div class="flex items-center gap-3 mt-1 text-sm opacity-60">
          <span class="flex items-center gap-1">
            <UIcon name="i-carbon-link" />
            {{ domain }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-carbon-calendar" />
            {{ formattedDate }}
          </span>
        </div>
        <!-- Vote Error Message -->
        <UAlert v-if="voteError" color="warning" class="mt-2 py-1">
          {{ voteError }}
        </UAlert>
      </div>
    </div>
  </UCard>
</template>
