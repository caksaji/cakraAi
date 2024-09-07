<template>
  <div>
    <div class="h-full pt-4" :style="{ paddingBottom: chatAreaPadding }">
      <div class="container max-w-screen-md" style="line-height: 1.25;">
        <div
          v-for="(m, index) in message"
          :key="index"
          class="flex"
          :class="[
            { 'justify-end': m.by === 'me' },
            index > 0 && message[index - 1].by !== m.by ? 'mt-4' : index > 0 ? 'mt-1' : null
          ]"
        >
          <div class="w-10/12 py-2 px-3 rounded-b-2xl md:w-8/12"
            :class="[
              {
                'bg-gray-300 dark:bg-gray-700': m.by === 'friend',
                'bg-prime-600': m.by === 'me'
              },
              m.by === 'friend' ? 'rounded-tr-2xl' : m.by === 'me' ? 'rounded-tl-2xl' : null,
              (index > 0 && m.by === 'friend' && message[index - 1].by === m.by) || (index > 0 && m.by === 'me' && message[index - 1].by === m.by) ? 'rounded-t-2xl' : null
            ]"
          >
            {{ m.message }}
            <div class="pt-1 text-right opacity-50">
              {{ m.at }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-screen bg-gray-100 dark:bg-gray-900">
      <div class="container max-w-screen-md py-4">
        <div class="flex items-end justify-between w-full space-x-2 p-1 rounded-[1.7rem] bg-gray-300 dark:bg-gray-700">
          <div class="w-full py-1 pl-2">
            <textarea
              v-model="cmd"
              ref="input"
              rows="1"
              placeholder="Ketik sesuatu disini"
              class="max-h-40 w-full outline-0 resize-none bg-transparent placeholder:text-gray-400"
              @keydown="inputKeydown"
              @input="setInputHeight"
            />
          </div>
          <div v-wave class="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-full bg-prime-600" :class="{ 'cursor-not-allowed': !cmd, 'cursor-pointer click-effect': cmd }" @click="submitInput">
            <IconSvg name="send" class="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconSvg from '~/components/partial/IconSvg'

const userCookie = useCookie('user')
const input = ref(null)
const chatAreaPadding = ref()
const cmd = ref()
const message = ref([])

onMounted(() => {
  setInputHeight()
  if (userCookie.value) {
    loadChat()
  }
  else {
    message.value.push({
      by: 'friend',
      message: 'Halo👋 gimana kabarnya? Yuk kenalan dulu...',
      at: `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`
    })
    setTimeout(() => {
      message.value.push({
        by: 'friend',
        message: 'Masukkan username kamu',
        at: `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`
      })
    }, 3000)
  }
})

const setInputHeight = () => {
  const inp = input.value
  inp.style.height = 'auto'
  inp.style.height = `${input.value.scrollHeight}px`
  chatAreaPadding.value = `calc((.25rem * 2) + (.25rem * 2) + 3rem + ${inp.style.height})`
}
const loadChat = () => {
  message.value = [
    {
      by: 'friend',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit reiciendis accusamus cumque rem? Facere consectetur reprehenderit quia voluptate.',
      at: '02:28'
    },
    {
      by: 'me',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit reiciendis accusamus cumque rem? Facere consectetur reprehenderit quia voluptate.',
      at: '02:29'
    },
    {
      by: 'friend',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit reiciendis accusamus cumque rem? Facere consectetur reprehenderit quia voluptate.',
      at: '02:30'
    }
  ]
}
const inputKeydown = (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    submitInput()
  }
}
const submitInput = () => {
  console.log('Enter key pressed')
}
</script>

<style lang="less" scoped>
  .click-effect { @apply transform duration-300 active:scale-90; }
</style>
