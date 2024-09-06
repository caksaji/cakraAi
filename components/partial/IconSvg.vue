<template>
  <!-- Src: iconoir -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    class="flex-shrink-0 stroke-2 stroke-current transform"
    :class="{ 'rotate-180': props.name === 'log-out' }"
    style="stroke-linecap: round; stroke-linejoin: round;"
  >
    <template v-if="props.name === 'send'">
      <path d="M22 12L3 20L6.5625 12L3 4L22 12Z" />
      <path d="M6.5 12L22 12" />
    </template>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: null, required: true }
})
</script>
