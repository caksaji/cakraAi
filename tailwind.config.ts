import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default <Partial<Config>>{
  theme: {
    darkMode: 'selector',
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        prime: colors.pink
      }
    }
  }
}
