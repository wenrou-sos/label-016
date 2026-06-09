<template>
  <n-message-provider ref="messageProviderRef">
    <n-dialog-provider ref="dialogProviderRef">
      <router-view />
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setMessageInstance } from './utils/request'
import type { MessageProviderInst, DialogProviderInst } from 'naive-ui'

const messageProviderRef = ref<MessageProviderInst | null>(null)
const dialogProviderRef = ref<DialogProviderInst | null>(null)

onMounted(() => {
  if (messageProviderRef.value) {
    setMessageInstance(messageProviderRef.value)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
