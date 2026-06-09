/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@kangc/v-md-editor' {
  const VueMarkdownEditor: any
  export default VueMarkdownEditor
  export function use(app: any): void
}

declare module '@kangc/v-md-editor/lib/theme/vuepress.js' {
  const vuepressTheme: any
  export default vuepressTheme
}

declare module 'prismjs' {
  const Prism: any
  export default Prism
}
