<template>
  <div>
    <div class="h-full pt-4 transform duration-300" :style="{ paddingBottom: chatAreaPadding }">
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
            <div class="text-wrap whitespace-pre">
              {{ m.message }}
            </div>
            <div class="pt-1 text-right" :class="{ 'opacity-40': m.by === 'friend', 'opacity-60': m.by === 'me' }">
              {{ m.at }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-screen bg-gray-100 transform duration-300 dark:bg-gray-900" :class="{ 'translate-y-full opacity-0': disableChat }">
      <div class="container max-w-screen-md py-4">
        <div class="flex items-end justify-between w-full space-x-2 p-1 rounded-[1.7rem] bg-gray-300 dark:bg-gray-700">
          <div class="w-full py-1 pl-2">
            <textarea
              v-model="cmd"
              ref="input"
              rows="1"
              placeholder="Ketik sesuatu disini"
              :disabled="disableChat"
              class="max-h-40 w-full outline-0 resize-none bg-transparent placeholder:text-gray-400"
              @keydown="inputKeydown"
              @input="setInputHeight"
            />
          </div>
          <div
            v-wave
            :tabindex="cmd ? 0 : -1"
            class="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-full outline-0 bg-prime-600 ring-prime-600 ring-opacity-90 focus:ring focus:ring-offset-2 dark:ring-offset-gray-800"
            :class="{ 'cursor-not-allowed': !cmd, 'cursor-pointer click-effect': cmd }"
            @click="submitInput"
            @keydown.enter="submitInput"
            @keydown.space="submitInput"
          >
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
const authStore = useAuthStore()
const input = ref(null)
const chatAreaPadding = ref()
const cmd = ref()
const message = ref([])
const inputLogin = ref({ username: null, password: null })
const disableChat = ref(true)

onMounted(() => {
  setInputHeight()
  if (userCookie.value) {
    addBubble({ by: 'friend', message: `Halo ${userCookie.value.firstName}👋 apa kabar?`, at: 'now' })
    // loadChat()
    disableChat.value = false
  }
  else {
    addBubble({ by: 'friend', message: 'Halo👋 apa kabar? Yuk kenalan...', at: 'now' })
    setTimeout(() => {
      addBubble({ by: 'friend', message: 'Masukkan username kamu', at: 'now' })
      disableChat.value = false
    }, 1000)
  }
})

const setInputHeight = () => {
  const inp = input.value
  inp.style.height = 'auto'
  inp.style.height = `${input.value.scrollHeight}px`
  chatAreaPadding.value = !disableChat.value ? `calc((.25rem * 2) + (.25rem * 2) + 3rem + ${inp.style.height})` : '1rem'
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
const addBubble = (chat) => {
  message.value.push({
    by: chat.by,
    message: chat.message,
    at: chat.at === 'now' ? `${new Date().getHours() < 10 ? '0' + new Date().getHours().toString() : new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes()}` : chat.at
  })
}
const submitInput = () => {
  if (!disableChat.value) {
    if (userCookie.value) {
      addBubble()
    }
    else {
      if (!inputLogin.value.username) {
        addBubble({ by: 'me', message: cmd.value, at: 'now' })
        inputLogin.value.username = JSON.parse(JSON.stringify(cmd.value))
        setTimeout(() => addBubble({ by: 'friend', message: 'Sekarang masukkan kata sandi', at: 'now' }), 1000)
      }
      else {
        addBubble({ by: 'me', message: '•••••••••', at: 'now' })
        inputLogin.value.password = JSON.parse(JSON.stringify(cmd.value))
        login()
      }
    }
    resetInput()
  }
}
const resetInput = () => {
  setTimeout(() => cmd.value = null, 500)
  setTimeout(() => setInputHeight(), 700)
}
const login = async () => {
  disableChat.value = true
  addBubble({ by: 'friend', message: 'Tunggu sebentar...', at: 'now' })
  await authStore.login(inputLogin.value)
    .then((res) => {
      userCookie.value = res
      addBubble({ by: 'friend', message: `Halo ${userCookie.value.firstName}👋 apa kabar?`, at: 'now' })
    })
    .catch((error) => {
      inputLogin.value.username = null
      inputLogin.value.password = null
      addBubble({ by: 'friend', message: `Username / kata sandi salah, ${error.response._data.message}`, at: 'now' })
      addBubble({ by: 'friend', message: 'Masukkan username kamu', at: 'now' })
    })
  disableChat.value = false
}
</script>

<style lang="less" scoped>
  .click-effect { @apply transform duration-300 active:scale-90; }
</style>
