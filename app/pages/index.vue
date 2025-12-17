<script setup lang="ts">
import type { Product } from '~/server/database/schema'

// SEO
useSeoMeta({
  title: 'Indie Board - 独立产品发现榜',
  description: '发现和分享独立开发者的优秀产品',
  ogTitle: 'Indie Board',
  ogDescription: '发现和分享独立开发者的优秀产品',
})

// Fetch products with polling (5 seconds)
const { data: products, refresh } = await useFetch<Product[]>('/api/products', {
  default: () => [],
})

// Polling mechanism - refresh every 5 seconds
const POLL_INTERVAL = 5000
let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  pollTimer = setInterval(() => {
    refresh()
  }, POLL_INTERVAL)
})

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
  }
})

// Handle vote - optimistic update
function handleVote(id: number) {
  const product = products.value.find(p => p.id === id)
  if (product) {
    product.votes++
    // Re-sort by votes
    products.value.sort((a, b) => b.votes - a.votes)
  }
}

// Handle submit - refresh list
function handleSubmit() {
  refresh()
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-base/80 backdrop-blur-lg border-b border-base">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-carbon-rocket" class="text-3xl text-primary animate-pulse" />
          <div>
            <h1 class="font-bold text-xl">Indie Board</h1>
            <p class="text-xs opacity-60">独立产品发现榜</p>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Products List -->
        <section class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <UIcon name="i-carbon-trending-up" class="text-primary" />
              热门产品
            </h2>
            <UBadge color="gray" variant="soft">
              <UIcon name="i-carbon-renewal" class="animate-spin mr-1" />
              实时更新中
            </UBadge>
          </div>

          <!-- Empty State -->
          <UCard v-if="!products.length" class="text-center py-12">
            <UIcon name="i-carbon-cube" class="text-6xl opacity-20 mb-4" />
            <p class="opacity-60">暂无产品，快来提交第一个吧！</p>
          </UCard>

          <!-- Products -->
          <TransitionGroup
            name="list"
            tag="div"
            class="space-y-4"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @vote="handleVote"
            />
          </TransitionGroup>
        </section>

        <!-- Submit Form Sidebar -->
        <aside>
          <div class="sticky top-24 space-y-4">
            <SubmitForm @submit="handleSubmit" />

            <!-- Info Card -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-1 text-sm font-medium">
                  <UIcon name="i-carbon-information" class="text-primary" />
                  关于
                </div>
              </template>
              <p class="text-sm opacity-70 leading-relaxed">
                Indie Board 是一个极简的独立产品发现榜，帮助您发现优秀的独立开发者作品。
              </p>
              <p class="text-xs opacity-50 mt-2">
                每个 IP 每 24 小时对同一产品只能投票一次
              </p>
            </UCard>
          </div>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-sm opacity-60">
      <p class="flex items-center justify-center gap-1">
        Made with
        <UIcon name="i-carbon-favorite-filled" class="text-error animate-pulse" />
        using
        <a href="https://nuxt.com" target="_blank" class="text-primary hover:underline">Nuxt</a>
        +
        <a href="https://unaui.com" target="_blank" class="text-primary hover:underline">Una UI</a>
      </p>
    </footer>
  </div>
</template>

<style>
/* List transition animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-leave-active {
  position: absolute;
}
</style>
