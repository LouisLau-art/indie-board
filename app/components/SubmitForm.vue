<script setup lang="ts">
const emit = defineEmits<{
  submit: [product: { title: string; url: string }]
}>()

// Form state
const title = ref('')
const url = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref(false)

// Use template ref (Vue 3.5+)
const titleInput = useTemplateRef<HTMLInputElement>('titleInput')

async function handleSubmit() {
  if (isSubmitting.value) return

  // Reset states
  error.value = ''
  success.value = false

  // Validate
  if (!title.value.trim()) {
    error.value = '请输入产品名称'
    return
  }

  if (!url.value.trim()) {
    error.value = '请输入产品链接'
    return
  }

  // Validate URL
  try {
    new URL(url.value)
  } catch {
    error.value = '请输入有效的 URL（包含 https://）'
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/products', {
      method: 'POST',
      body: {
        title: title.value.trim(),
        url: url.value.trim(),
      },
    })

    // Success!
    success.value = true
    title.value = ''
    url.value = ''
    emit('submit', { title: title.value, url: url.value })

    // Reset success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err: any) {
    error.value = err.data?.statusMessage || '提交失败，请重试'
  } finally {
    isSubmitting.value = false
  }
}

// Focus input on mount
onMounted(() => {
  titleInput.value?.focus()
})
</script>

<template>
  <div class="card">
    <h2 class="font-bold text-xl flex items-center gap-2 mb-4">
      <span class="i-carbon-add-alt text-emerald-500"></span>
      提交新产品
    </h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="title" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">产品名称</label>
        <input
          id="title"
          ref="titleInput"
          v-model="title"
          type="text"
          class="input"
          placeholder="例如：Vue.js"
          :disabled="isSubmitting"
        >
      </div>

      <div>
        <label for="url" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">产品链接</label>
        <input
          id="url"
          v-model="url"
          type="text"
          class="input"
          placeholder="https://example.com"
          :disabled="isSubmitting"
        >
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert-error flex items-center gap-2">
        <span class="i-carbon-warning"></span>
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="alert-success flex items-center gap-2">
        <span class="i-carbon-checkmark-filled"></span>
        提交成功！
      </div>

      <button
        type="submit"
        class="btn-primary w-full"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="i-carbon-circle-dash animate-spin"></span>
        <span v-else class="i-carbon-send"></span>
        {{ isSubmitting ? '提交中...' : '提交产品' }}
      </button>
    </form>
  </div>
</template>
