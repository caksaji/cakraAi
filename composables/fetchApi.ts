export const fetchApi = async (path, data) => {
  const userCookie = useCookie('user')
  return await $fetch(`https://dummyjson.com/${path}`, {
    ...data,
    headers: userCookie.value
      ? { Authorization: `Bearer ${userCookie.value.token}` }
      : {}
  })
}
