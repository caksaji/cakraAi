<template>
  <div class="w-full max-w-xl">
    <div class="w-full bg-contain bg-no-repeat bg-center h-24 sm:h-40" :style="{ backgroundImage: `url(/img/${type === 404 ? 'error-data404' : 'error'}.svg)` }" />
    <div class="text-center">
      <slot />
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    type: { type: Number, default: 404 }, // 404, 500
  })
</script>
