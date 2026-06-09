import { createApp } from 'vue'
import { create, NButton, NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NCheckbox, NCheckboxGroup, NRadio, NRadioGroup, NSpace, NIcon, NTag, NBadge, NAvatar, NRate, NDescriptions, NDescriptionsItem, NTabs, NTabPane, NTimeline, NTimelineItem, NMenu, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NBreadcrumb, NBreadcrumbItem, NDropdown, NSpin, NEmpty, NPagination, NModal, NDialogProvider, NMessageProvider, NDialog } from 'naive-ui'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import 'highlight.js/styles/atom-one-dark.css'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import { useUserStore } from './stores/user'
import './styles/global.css'

VueMarkdownEditor.use(vuepressTheme, {
  Prism
})

const naive = create({
  components: [
    NButton,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    NCheckbox,
    NCheckboxGroup,
    NRadio,
    NRadioGroup,
    NSpace,
    NIcon,
    NTag,
    NBadge,
    NAvatar,
    NRate,
    NDescriptions,
    NDescriptionsItem,
    NTabs,
    NTabPane,
    NTimeline,
    NTimelineItem,
    NMenu,
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NBreadcrumb,
    NBreadcrumbItem,
    NDropdown,
    NSpin,
    NEmpty,
    NPagination,
    NModal,
    NDialogProvider,
    NMessageProvider,
    NDialog
  ]
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(naive)
app.use(VueMarkdownEditor)

const userStore = useUserStore()
userStore.initAuth()

app.mount('#app')
