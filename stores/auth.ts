export const useAuthStore = defineStore('auth', () => {
  const login = async data => await fetchApi('auth/login', { method: 'post', body: data })

  return {
    login
  }
})
