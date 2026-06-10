<template>
  <div class="submit-page">
    <n-card title="提交稿件" :bordered="false">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        label-width="auto"
      >
        <n-form-item label="标题" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入稿件标题"
            maxlength="200"
            show-count
          />
        </n-form-item>

        <n-form-item
          label="摘要"
          path="abstract"
          :feedback="`${formData.abstract.length}/500`"
        >
          <n-input
            v-model:value="formData.abstract"
            type="textarea"
            placeholder="请输入稿件摘要（不超过500字）"
            :rows="4"
            maxlength="500"
            show-count
          />
        </n-form-item>

        <n-form-item label="标签" path="tags">
          <n-checkbox-group v-model:value="formData.tags">
            <n-space wrap>
              <n-checkbox
                v-for="tag in TAGS"
                :key="tag"
                :value="tag"
              >
                {{ tag }}
              </n-checkbox>
            </n-space>
          </n-checkbox-group>
        </n-form-item>

        <n-form-item label="正文" path="content">
          <div class="markdown-editor-wrapper">
            <v-md-editor
              v-model="formData.content"
              height="500px"
              placeholder="请使用Markdown格式撰写稿件正文..."
            />
          </div>
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleSubmit"
            >
              提交稿件
            </n-button>
            <n-button size="large" @click="handleReset">
              重置
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NCheckboxGroup, NCheckbox, NSpace, NButton, useMessage, useDialog } from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { TAGS, type Tag, type ManuscriptSubmitRequest } from '@/types'
import { submitManuscript } from '@/api/manuscript'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const formRef = ref()
const loading = ref(false)

const formData = reactive<ManuscriptSubmitRequest & { tags: Tag[] }>({
  title: '',
  abstract: '',
  content: '',
  tags: []
})

const validateTags = (_rule: any, value: Tag[]) => {
  if (value.length === 0) {
    return new Error('请至少选择一个标签')
  }
  return true
}

const rules: FormRules = {
  title: [
    { required: true, message: '请输入稿件标题', trigger: 'blur' },
    { min: 5, max: 200, message: '标题长度在5-200个字符之间', trigger: 'blur' }
  ],
  abstract: [
    { required: true, message: '请输入稿件摘要', trigger: 'blur' },
    { min: 10, max: 500, message: '摘要长度在10-500个字符之间', trigger: 'blur' }
  ],
  tags: [
    { validator: validateTags, trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入稿件正文', trigger: 'blur' },
    { min: 50, message: '正文内容不能少于50个字符', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    
    dialog.warning({
      title: '确认提交',
      content: '提交后稿件将进入审核流程，确认提交吗？',
      positiveText: '确认提交',
      negativeText: '取消',
      onPositiveClick: async () => {
        loading.value = true
        try {
          const res = await submitManuscript(formData)
          message.success('稿件提交成功，等待审核')
          router.push(`/author/manuscripts/${res.id}`)
        } catch (e: any) {
          message.error(e.message || '提交失败')
        } finally {
          loading.value = false
        }
      }
    })
  } catch (e) {
    console.log('验证失败')
  }
}

function handleReset() {
  formRef.value.restoreValidation()
  formData.title = ''
  formData.abstract = ''
  formData.content = ''
  formData.tags = []
}
</script>

<style scoped>
.submit-page {
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.markdown-editor-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

:deep(.v-md-editor) {
  border: none;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__toolbar) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__editor-wrapper) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__preview-wrapper) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__editor),
:deep(.v-md-editor__preview) {
  width: 100% !important;
  box-sizing: border-box;
}
</style>
