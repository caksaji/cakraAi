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
            <MDC :value="m.message" class="text-wrap whitespace-pre prose dark:prose-invert" />
            <div class="pt-1 text-right" :class="{ 'opacity-40': m.by === 'friend', 'opacity-60': m.by === 'me' }">
              {{ m.at }}
            </div>
          </div>
        </div>
        <div v-if="loadingChat" class="mt-4">
          <div class="w-60 p-4 rounded-tr-2xl rounded-b-2xl bg-gray-300 dark:bg-gray-700">
            <div class="h-2 rounded-full bg-white loading-progress" />
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
              @focus="setInputCursorPosition"
              @input="setInputHeight"
            />
          </div>
          <div class="flex items-center justify-center relative h-12 px-2">
            <IconSvg name="emoji" class="h-6 w-6 cursor-pointer click-effect" @click="toggleEmojiPanel" />
            <NuxtEmojiPicker
              native
              theme="auto"
              :static-texts="{ placeholder: 'Cari emoji', skinTone: 'Warna'}"
              class="absolute bottom-full -right-16 transform duration-300"
              :class="{ 'translate-y-12 opacity-0': !showEmojiPanel }"
              :style="{ height: !showEmojiPanel ? 0 : null }"
              @select="selectEmoji"
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
const geminiCookie = useCookie('gemini')
const authStore = useAuthStore()
const chatStore = useChatStore()
const input = ref(null)
const inputCursorPosition = ref(0)
const chatAreaPadding = ref()
const cmd = ref('')
const showEmojiPanel = ref(false)
const message = ref([])
const inputLogin = ref({ username: null, password: null })
const disableChat = ref(true)
const loadingChat = ref(false)

onMounted(() => {
  geminiCookie.value = 'AIzaSyAUV0-1FcPFwSYn1g9jezUm1Iijrm5HQTA'
  setInputHeight()
  if (userCookie.value) {
    addBubble({ by: 'friend', message: `Halo ${userCookie.value.firstName}👋 apa kabar?`, at: 'now' })
    disableChat.value = false
    cmd.value = 'Apa berita baik terkini?'
    setTimeout(() => submitInput(), 500)
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
  setInputCursorPosition()
}
const setInputCursorPosition = () => {
  inputCursorPosition.value = input.value.selectionStart
}
const inputKeydown = (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    submitInput()
  }
}
const toggleEmojiPanel = () => showEmojiPanel.value = !disableChat.value ? !showEmojiPanel.value : false
const selectEmoji = (emoji) => {
  cmd.value += emoji.i
  toggleEmojiPanel()
  // const start = cmd.value.slice(0, inputCursorPosition.value)
  // const end = cmd.value.slice(inputCursorPosition.value)
  // cmd.value = `${start}${emoji.i}${end}`
  // inputCursorPosition.value += emoji.r.length
  // toggleEmojiPanel()
  // $nextTick(() => {
  //   input.value.setSelectionRange(inputCursorPosition.value, inputCursorPosition.value)
  //   input.value.focus()
  // })
}
const addBubble = (chat) => {
  message.value.push({
    by: chat.by,
    message: chat.message,
    at: chat.at === 'now' ? `${new Date().getHours() < 10 ? '0' + new Date().getHours().toString() : new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes()}` : chat.at
  })
}
const submitInput = async () => {
  if (!disableChat.value) {
    if (userCookie.value) {
      addBubble({ by: 'me', message: cmd.value, at: 'now' })
      disableChat.value = true
      loadingChat.value = true
      await chatStore.sendMessage(cmd.value)
        .then((res) => {
          addBubble({ by: 'friend', message: res.candidates[0].content.parts[0].text, at: 'now' })
        })
        .catch((error) => {
          addBubble({ by: 'friend', message: error.response._data.message, at: 'now' })
        })
      disableChat.value = false
      loadingChat.value = false
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
  loadingChat.value = true
  await authStore.login(inputLogin.value)
    .then((res) => {
      userCookie.value = res
      addBubble({ by: 'friend', message: `Halo ${userCookie.value.firstName}👋 mau tahu apa kali ini?`, at: 'now' })
      cmd.value = 'Apa berita baik terkini?'
      setTimeout(() => submitInput(), 500)
    })
    .catch((error) => {
      inputLogin.value.username = null
      inputLogin.value.password = null
      addBubble({ by: 'friend', message: `Username / kata sandi salah, ${error.response._data.message}`, at: 'now' })
      addBubble({ by: 'friend', message: 'Masukkan username kamu', at: 'now' })
    })
  disableChat.value = false
  loadingChat.value = false
}
</script>

<style lang="less" scoped>
  .click-effect { @apply transform duration-300 active:scale-90; }
  .loading-progress {
    animation-name: loading-progress;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
  }
  @keyframes loading-progress {
    0% { width: 0; }
    100% { width: 100%; }
  }
</style>
