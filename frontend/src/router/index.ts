import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/user'
import { setRouterInstance } from '@/utils/request'
import type { UserRole } from '@/types'

NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', guest: true }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: { title: '稿件详情' }
  },
  {
    path: '/author',
    name: 'Author',
    component: () => import('@/views/author/Layout.vue'),
    meta: { title: '作者工作台', roles: ['author'] as UserRole[] },
    children: [
      {
        path: '',
        redirect: '/author/manuscripts'
      },
      {
        path: 'submit',
        name: 'AuthorSubmit',
        component: () => import('@/views/author/Submit.vue'),
        meta: { title: '提交稿件', roles: ['author'] as UserRole[] }
      },
      {
        path: 'manuscripts',
        name: 'AuthorManuscripts',
        component: () => import('@/views/author/Manuscripts.vue'),
        meta: { title: '我的稿件', roles: ['author'] as UserRole[] }
      },
      {
        path: 'manuscripts/:id',
        name: 'AuthorManuscriptDetail',
        component: () => import('@/views/author/ManuscriptDetail.vue'),
        meta: { title: '稿件详情', roles: ['author'] as UserRole[] }
      }
    ]
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/editor/Layout.vue'),
    meta: { title: '编辑工作台', roles: ['editor'] as UserRole[] },
    children: [
      {
        path: '',
        redirect: '/editor/review'
      },
      {
        path: 'review',
        name: 'EditorReview',
        component: () => import('@/views/editor/ReviewList.vue'),
        meta: { title: '待审稿件', roles: ['editor'] as UserRole[] }
      },
      {
        path: 'review/:id',
        name: 'EditorReviewDetail',
        component: () => import('@/views/editor/ReviewDetail.vue'),
        meta: { title: '审稿', roles: ['editor'] as UserRole[] }
      }
    ]
  },
  {
    path: '/chief',
    name: 'Chief',
    component: () => import('@/views/chief/Layout.vue'),
    meta: { title: '主编工作台', roles: ['chief_editor'] as UserRole[] },
    children: [
      {
        path: '',
        redirect: '/chief/decision'
      },
      {
        path: 'decision',
        name: 'ChiefDecision',
        component: () => import('@/views/chief/DecisionList.vue'),
        meta: { title: '终审稿件', roles: ['chief_editor'] as UserRole[] }
      },
      {
        path: 'decision/:id',
        name: 'ChiefDecisionDetail',
        component: () => import('@/views/chief/DecisionDetail.vue'),
        meta: { title: '终审决策', roles: ['chief_editor'] as UserRole[] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  NProgress.start()
  document.title = (to.meta.title as string) ? `${to.meta.title} - 稿件管理系统` : '稿件管理系统'

  const userStore = useUserStore()
  
  if (to.meta.guest) {
    if (userStore.isAuthenticated) {
      next(getDefaultRoute(userStore.userRole))
    } else {
      next()
    }
  } else if (to.meta.roles) {
    if (!userStore.isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else if (!userStore.hasRole(to.meta.roles as UserRole[])) {
      next('/403')
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

function getDefaultRoute(role: string | null): string {
  switch (role) {
    case 'author':
      return '/author/manuscripts'
    case 'editor':
      return '/editor/review'
    case 'chief_editor':
      return '/chief/decision'
    default:
      return '/'
  }
}

setRouterInstance(router)

export default router
