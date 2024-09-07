export const fetchApiGemini = async (data) => {
  const geminiCookie = useCookie('gemini')
  return await $fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiCookie.value}`, {
    method: 'post',
    body: {
      contents: [
        {
          role: 'user',
          parts: [{ text: data }]
        }
      ]
    }
  })
}
