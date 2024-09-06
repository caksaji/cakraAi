<template>
  <div class="font-bold text-red-500" style="font-size: 5rem;">
    {{ hello }}
  </div>
</template>

<script setup>
const hello = ref(null)

onMounted(() => {
  hello.value = 'Pangarea'
})
</script>
