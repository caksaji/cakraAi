export const useChatStore = defineStore('chat', () => {
  const sendMessage = async data => await fetchApiGemini(data)

  return {
    sendMessage
  }
})
