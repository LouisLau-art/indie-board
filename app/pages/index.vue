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
    <!-- Navbar -->
    <div class="navbar bg-base-100/80 backdrop-blur-lg sticky top-0 z-50 border-b border-base-200">
      <div class="max-w-4xl mx-auto w-full px-4">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <span class="i-carbon-rocket text-3xl text-primary animate-pulse"></span>
            <div>
              <h1 class="font-bold text-xl">Indie Board</h1>
              <p class="text-xs opacity-60">独立产品发现榜</p>
            </div>
          </div>
        </div>
        <div class="flex-none">
          <ThemeToggle />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Products List -->
        <section class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span class="i-carbon-trending-up text-primary"></span>
              热门产品
            </h2>
            <div class="badge badge-ghost gap-1">
              <span class="loading loading-ring loading-xs"></span>
              实时更新中
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!products.length" class="card bg-base-100 shadow-xl">
            <div class="card-body items-center text-center py-12">
              <span class="i-carbon-cube text-6xl opacity-20"></span>
              <p class="opacity-60">暂无产品，快来提交第一个吧！</p>
            </div>
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
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title text-sm">
                  <span class="i-carbon-information text-primary"></span>
                  关于
                </h3>
                <p class="text-sm opacity-70 leading-relaxed">
                  Indie Board 是一个极简的独立产品发现榜，帮助您发现优秀的独立开发者作品。
                </p>
                <p class="text-xs opacity-50 mt-2">
                  每个 IP 每 24 小时对同一产品只能投票一次
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer footer-center p-8 text-base-content/60">
      <div class="flex items-center gap-1">
        Made with
        <span class="i-carbon-favorite-filled text-error animate-pulse"></span>
        using
        <a href="https://nuxt.com" target="_blank" class="link link-primary">Nuxt</a>
        +
        <a href="https://daisyui.com" target="_blank" class="link link-primary">DaisyUI</a>
      </div>
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
