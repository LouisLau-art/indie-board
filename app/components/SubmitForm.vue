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
  <UCard>
    <template #header>
      <div class="flex items-center gap-2 font-bold">
        <UIcon name="i-carbon-add-alt" class="text-primary text-xl" />
        提交新产品
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UFormGroup label="产品名称">
        <UInput
          ref="titleInput"
          v-model="title"
          placeholder="例如：Vue.js"
          :disabled="isSubmitting"
        />
      </UFormGroup>

      <UFormGroup label="产品链接">
        <UInput
          v-model="url"
          placeholder="https://example.com"
          :disabled="isSubmitting"
        />
      </UFormGroup>

      <!-- Error Message -->
      <UAlert v-if="error" color="error" icon="i-carbon-warning">
        {{ error }}
      </UAlert>

      <!-- Success Message -->
      <UAlert v-if="success" color="success" icon="i-carbon-checkmark-filled">
        提交成功！
      </UAlert>

      <UButton
        type="submit"
        color="primary"
        :loading="isSubmitting"
        block
      >
        <template #leading>
          <UIcon name="i-carbon-send" />
        </template>
        {{ isSubmitting ? '提交中...' : '提交产品' }}
      </UButton>
    </form>
  </UCard>
</template>
