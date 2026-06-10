<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h1 class="title">注册账号</h1>
        <p class="subtitle">创建您的稿件管理系统账号</p>
      </div>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        size="large"
        class="register-form"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <n-icon><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="formData.email"
            placeholder="请输入邮箱地址"
          >
            <template #prefix>
              <n-icon><MailOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-radio-group v-model:value="formData.role">
            <n-space>
              <n-radio value="author">作者</n-radio>
              <n-radio value="editor">编辑</n-radio>
              <n-radio value="chief_editor">主编</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入密码"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-button
          type="primary"
          size="large"
          block
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </n-button>
      </n-form>
      <div class="register-footer">
        <span>已有账号？</span>
        <n-button text type="primary" @click="goLogin">立即登录</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NIcon, NRadioGroup, NRadio, NSpace, useMessage } from 'naive-ui'
import { PersonOutline, MailOutline, LockClosedOutline } from '@vicons/ionicons5'
import type { FormRules } from 'naive-ui'
import type { UserRole } from '@/types'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  role: 'author' as UserRole,
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: string) => {
  if (value !== formData.password) {
    return new Error('两次输入的密码不一致')
  }
  return true
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度在6-32个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

async function handleRegister() {
  try {
    await formRef.value.validate()
    loading.value = true
    
    const { confirmPassword, ...registerData } = formData
    await userStore.registerAction(registerData)
    
    message.success('注册成功')
    
    const defaultRoute = userStore.userRole === 'author' 
      ? '/author/manuscripts' 
      : userStore.userRole === 'editor' 
        ? '/editor/review' 
        : '/chief/decision'
    
    router.push(defaultRoute)
  } catch (e: any) {
    if (e.errors) {
      return
    }
    message.error(e.message || '注册失败')
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.register-form {
  margin-bottom: 24px;
}

.register-footer {
  text-align: center;
  font-size: 14px;
  color: #999;
}

.register-footer span {
  margin-right: 4px;
}
</style>
