<template>
  <div class="tag-filter">
    <n-space wrap :size="8">
      <n-tag
        v-for="tag in allTags"
        :key="tag"
        :type="isSelected(tag) ? 'primary' : 'default'"
        :checkable="true"
        :checked="isSelected(tag)"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </n-tag>
    </n-space>
    <n-button
      v-if="selectedTags.length > 0"
      size="small"
      text
      @click="clearAll"
    >
      清除筛选
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpace, NTag, NButton } from 'naive-ui'
import { TAGS, type Tag } from '@/types'

interface Props {
  modelValue: Tag[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Tag[]): void
}>()

const allTags = computed(() => TAGS)
const selectedTags = computed(() => props.modelValue)

function isSelected(tag: Tag): boolean {
  return selectedTags.value.includes(tag)
}

function toggleTag(tag: Tag) {
  const newValue = isSelected(tag)
    ? selectedTags.value.filter(t => t !== tag)
    : [...selectedTags.value, tag]
  emit('update:modelValue', newValue)
}

function clearAll() {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.tag-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tag-filter :deep(.n-tag) {
  cursor: pointer;
}
</style>
