<template>
  <div class="container flex items-center justify-center h-screen w-full max-w-sm">
    <ErrorStatement :type="error.statusCode">
      <div v-if="error.statusCode === 404">
        Ups, sepertinya kamu begitu menikmati hingga akhirnya tersesat.
        <div class="space-y-1 pt-2">
          <div v-for="(step, index) in resolveStep404" :key="index" class="flex space-x-2">
            <div class="flex-shrink-0 h-2 w-2 rounded-full mt-2.5 bg-gray-800 dark:bg-white" />
            <div :class="{ 'flex space-x-1': index === resolveStep404.length - 1 }">
              <div class="flex-shrink-0 pt-0.5">
                {{ step }}
              </div>
              <div v-if="index === resolveStep404.length - 1" v-wave class="py-1 px-3 rounded-xl bg-prime-600 cursor-pointer" @click="goToHome">
                Kembali ke halaman utama
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        Ups, sepertinya terjadi gangguan koneksi ke server, coba periksa koneksi internetmu dan jika tidak berhasil kemungkinan sedang dilakukan perawatan server.
      </template>
    </ErrorStatement>
  </div>
</template>

<script setup>
import ErrorStatement from '~/components/partial/ErrorStatement'

defineProps(['error'])

const resolveStep404 = ['Tetap tenang', 'Tarik nafas', 'Minum air', 'Istirahat sejenak', 'Lalu']

const goToHome = () => navigateTo('/', { replace: true })
</script>
