<template>
  <div class="not-found-page">
    <Navbar />
    <div class="content">
      <div class="error-code">404</div>
      <h1 class="title">页面未找到</h1>
      <p class="description">抱歉，您访问的页面不存在或已被移除。</p>
      <n-button type="primary" size="large" @click="goHome">
        返回首页
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 20px;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 20px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.description {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
}
</style>
