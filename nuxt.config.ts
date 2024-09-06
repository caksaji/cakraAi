// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: ['~/assets/style/_allBundle.less'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'v-wave/nuxt',
    '@nuxtjs/google-fonts'
  ],
  alias: { pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs' },
  tailwindcss: { viewer: false },
  googleFonts: {
    families: {
      Raleway: {
        wght: [400, 500, 600, 700]
      }
    },
    display: 'swap'
  },
  pinia: {
    storesDirs: ['./stores/**']
  }
})
