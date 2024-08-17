// 该文件专门用于创建路由器
import {createRouter , createWebHashHistory} from 'vue-router'

// 跳转进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
 
NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载 icon
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})

// 路由懒加载
const HomePage = () => import('@/pages/HomePage.vue')
const ProblemList = () => import('@/pages/ProblemList.vue')
const Problem = () => import('@/pages/Problem.vue')
const StatusRecord = () => import('@//pages/StatusRecord.vue')
const UserHome = () => import('@/pages/UserHome.vue') 
const UserSetting = () => import('@/pages/UserSetting.vue')
const Admin = () => import('@/pages/Admin.vue')
const ProblemEditor = () => import('@/pages/Editor/ProblemEditor.vue')

const AdminProblem = () => import('@/pages/Admin/AdminProblem.vue') 
const AdminUser = () => import('@/pages/Admin/AdminUser.vue')

const routes = [
    {
        path:'/',
        name:'HomePage',
        component:HomePage,
        meta: { title: 'HomePage | XYOJ' },
    },
    {
        path:'/problemlist',
        name:'ProblemList',
        component:ProblemList,
        meta: { title: 'ProblemList | XYOJ' },
    },
    {
        path:'/problem',
        name:'Problem',
        component:Problem,
        meta: { title: 'Problem | XYOJ' },
    },
    {
        path:'/statusrecord',
        name:'StatusRecord',
        component:StatusRecord,
        meta: { title: 'StatusRecord | XYOJ' },
    },
    {
        path:'/userhome',
        name:'UserHome',
        component:UserHome,
        meta: { title: 'UserHome | XYOJ' },
    },
    {
        path:'/usersetting',
        name:'UserSetting',
        component:UserSetting,
        meta: { title: 'UserSetting | XYOJ' },
    },
    {
        path:'/admin',
        name:'Admin',
        component:Admin,
        meta: { title: 'Admin | XYOJ' },
        children:[
            {
                path:'adminproblem',
                component: AdminProblem,
                meta: { title: 'AdminProblem | XYOJ' },
            },
            {
                path:'adminuser',
                component: AdminUser,
                meta: { title: 'AdminUser | XYOJ' },
            }
        ]
    },
    {
        path:'/problemeditor',
        name:'ProblemEditor',
        component:ProblemEditor,
        meta: { title: 'ProblemEditor | XYOJ' },
    },
]

//创建并暴露一个路由器
const router = createRouter({
    history:createWebHashHistory(),
	routes:routes
})

router.beforeEach((to, from, next) => {
    to.meta.title && (document.title = to.meta.title);
    NProgress.start() // 进度条开始
    next()
})

router.afterEach(() => {
    NProgress.done() // 进度条结束
})
   
export default router