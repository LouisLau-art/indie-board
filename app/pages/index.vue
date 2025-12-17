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
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="i-carbon-rocket text-3xl text-emerald-500 animate-pulse"></span>
          <div>
            <h1 class="font-bold text-xl">Indie Board</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">独立产品发现榜</p>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Products List -->
        <section class="md:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-bold text-2xl flex items-center gap-2">
              <span class="i-carbon-trending-up text-emerald-500"></span>
              热门产品
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span class="i-carbon-renewal animate-spin-slow"></span>
              实时更新中
            </span>
          </div>

          <!-- Empty State -->
          <div v-if="!products.length" class="card text-center py-12">
            <span class="i-carbon-cube text-4xl text-gray-300 dark:text-gray-600 mb-4 block"></span>
            <p class="text-gray-500 dark:text-gray-400">暂无产品，快来提交第一个吧！</p>
          </div>

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
            <div class="card">
              <h3 class="font-medium flex items-center gap-1 mb-2">
                <span class="i-carbon-information text-emerald-500"></span>
                关于
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Indie Board 是一个极简的独立产品发现榜，帮助您发现优秀的独立开发者作品。
              </p>
              <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                每个 IP 每 24 小时对同一产品只能投票一次
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p class="flex items-center justify-center gap-1">
        Made with
        <span class="i-carbon-favorite-filled text-red-500 animate-pulse"></span>
        using
        <a
          href="https://nuxt.com"
          target="_blank"
          class="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Nuxt
        </a>
        +
        <a
          href="https://unocss.dev"
          target="_blank"
          class="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          UnoCSS
        </a>
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

/* Custom animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
