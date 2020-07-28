<template>
	<div class="NavBar">
		<div class="icon_box">
			<img src="../assets/img/logo.png" width="55%" alt="">
			<i :class='isCollapse? "el-icon-s-fold":"el-icon-s-unfold"' @click="isShow"></i>
		</div>
		<el-dropdown>
			<span class="el-dropdown-link">
				<el-avatar :src="avatar"></el-avatar><span style="margin-left: 10px;font-size: 14px;">{{username}}</span> <i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>消息</el-dropdown-item>
				<el-dropdown-item>设置</el-dropdown-item>
				<el-dropdown-item><span @click='exit'>退出</span></el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
	import New from '@/new.js'
	import { admin } from '@/api/index'
	export default {
		data() {
			return {
				isCollapse: true,
				username: '',
				avatar: ""
			}
		},
		async created() {
			var id = sessionStorage.id;
			let { data: { username, avatar } } = await admin.info({ id });
			this.username = username;
			this.avatar = avatar;

			// New.$on('getisshow',(data)=>{
			// 	console.log(this);
			// })
		},
		mounted() {
			// New.$on('getisshow',(data)=>{
			// 	console.log(this);
			// })
		},
		methods: {
			isShow() {
				this.isCollapse = !this.isCollapse;
				this.$emit('change', this.isCollapse);
			},
			exit() {
				this.$router.replace('/login')
				sessionStorage.token = '';
				sessionStorage.id = '';

			}
		}
	}
</script>

<style scoped="scoped">
	.icon_box {
		display: flex;
		cursor: pointer;
		align-items: center;
	}

	.icon_box>.el-icon-s-fold,
	.icon_box>.el-icon-s-unfold {
		font-size: 25px;
	}

	.NavBar {
		background-color: black;
		color: white;
		height: 60px;
		line-height: 60px;
		display: flex;
		padding: 0 20PX;
		justify-content: space-between;
	}

	.el-dropdown {
		border-bottom: 2px solid orange;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: white;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

	.el-dropdown-link {
		display: flex;
		align-items: center;
	}

	.el-dropdown-menu {
		width: 100px;
	}
</style>
