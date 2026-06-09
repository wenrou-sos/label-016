<template>
  <div class="markdown-viewer" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

interface Props {
  content: string
}

const props = defineProps<Props>()

const renderedContent = computed(() => renderMarkdown(props.content))
</script>

<style scoped>
.markdown-viewer {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

.markdown-viewer :deep(h1),
.markdown-viewer :deep(h2),
.markdown-viewer :deep(h3),
.markdown-viewer :deep(h4),
.markdown-viewer :deep(h5),
.markdown-viewer :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-viewer :deep(h1) {
  font-size: 2em;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaecef;
}

.markdown-viewer :deep(h2) {
  font-size: 1.5em;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaecef;
}

.markdown-viewer :deep(h3) {
  font-size: 1.25em;
}

.markdown-viewer :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-viewer :deep(ul),
.markdown-viewer :deep(ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-viewer :deep(li) {
  margin-bottom: 4px;
}

.markdown-viewer :deep(blockquote) {
  margin: 0 0 16px 0;
  padding: 12px 16px;
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  background: #f8f9fa;
}

.markdown-viewer :deep(code) {
  padding: 2px 6px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  background: #f6f8fa;
  border-radius: 4px;
  color: #d63384;
}

.markdown-viewer :deep(pre) {
  margin: 0 0 16px 0;
  padding: 16px;
  overflow: auto;
  background: #282c34;
  border-radius: 6px;
}

.markdown-viewer :deep(pre code) {
  padding: 0;
  background: transparent;
  color: #abb2bf;
  font-size: 0.85em;
  line-height: 1.6;
}

.markdown-viewer :deep(table) {
  width: 100%;
  margin-bottom: 16px;
  border-collapse: collapse;
}

.markdown-viewer :deep(th),
.markdown-viewer :deep(td) {
  padding: 12px;
  border: 1px solid #dfe2e5;
  text-align: left;
}

.markdown-viewer :deep(th) {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-viewer :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.markdown-viewer :deep(a:hover) {
  text-decoration: underline;
}

.markdown-viewer :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.markdown-viewer :deep(hr) {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #eaecef;
}
</style>
