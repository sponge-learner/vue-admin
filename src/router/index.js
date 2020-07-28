import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue'
import { Message } from 'element-ui'
Vue.use(VueRouter)

const routes = [{
		path: '/login',
		alias: '/',
		name: 'login',
		meta: { requiresAuth: false },
		component: () => import('@/views/Login.vue')
	},
	{
		path: '/registe',
		name: 'registe',
		meta: { requiresAuth: false },
		component: () => import('@/views/Registe.vue')
	},
	{
		path: '/goods/',
		name: 'goods',
		meta: { requiresAuth: true },
		component: Layout,
		children: [{
				path: 'list',
				name: 'goodsList',
				component: () => import('@/views/goods/List.vue')
			},
			{
				path: 'release',
				name: 'goodsRelease',
				component: () => import('@/views/goods/Release.vue')
			},
			{
				path: 'category',
				name: 'goodsCategory',
				component: () => import('@/views/goods/Category.vue')
			},
			{
				path: 'edit/:id',
				name: 'goodsEdit',
				props:true,
				component: () => import('@/views/goods/Edit.vue')
			}
		]
	},
	{
		path: '/order/',
		name: "order",
		meta: { requiresAuth: true },
		component: Layout,
		children: [{
			path: 'list',
			name: 'orderList',
			component: () => import('@/views/older/List.vue')
		}]
	},
	{
		path: '/user/',
		name: "user",
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'userList',
				component: () => import('@/views/user/List.vue')
			},
			{
				path: 'info',
				name: 'userInfo',
				component: () => import('@/views/user/Info.vue')
			},
		]
	},
	{
		path: '/auth/',
		name: "auth",
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'role',
				name: 'authRole',
				component: () => import('@/views/auth/Role.vue')
			},
			{
				path: 'menu',
				name: 'authMenu',
				component: () => import('@/views/auth/Menu.vue')
			},
		]
	},
];

const router = new VueRouter({
	routes
})
router.beforeEach((to, from, next) => {
	//根据meta元信息校验路由是否需要登录授权
	let isRequiresAuth = to.matched.some((path) => path.meta.requiresAuth);
	if (!isRequiresAuth) {
		next();
		return;
	}
	//校验token
	let token = sessionStorage.token;
	//有token 放行
	if (token) {
		next();
		return;
	}
	if (!token) {
	// 	//无token，强制跳转登录		
		Message.error('无效的token，请重新登录');
		setTimeout(() => {
			next(`/login?redirect=${to.path}`);
		}, 2000)
	}
})
export default router
