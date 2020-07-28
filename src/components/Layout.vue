<template>
	<div>
		<el-container>
			<!-- 头部 -->
			<el-header style="padding: 0px;height: auto;">
				<Nav @change='change($event)'></Nav>
			</el-header>
			<el-container>
				<!-- 左菜单 -->
				<el-aside width="auto">
					<LeftMenu :isCollapse='isCollapse'></LeftMenu>
				</el-aside>
				<!-- 右主题 -->
				<el-main>
					<router-view ></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import Nav from '@/components/Nav.vue'
	import LeftMenu from '@/components/LeftMenu.vue'
	import login from '@/views/Login.vue'
	import New from '@/new.js'
	export default {
		name: "",
		data () {
			return {
				isCollapse: ''

			}
		},
		components: {
			Nav,
			LeftMenu,
		},
		created() {
			

		},
		methods: {
			change(val) {
				this.isCollapse = val;
			},
			editIcon(data){
				console.log(data);
			}
		}
	}
</script>

<style >
	html,
	body {
		margin: 0;
		padding: 0;
	}

	.el-aside {
		height: auto;
		background-color: rgb(51, 78, 102);
	}
</style>
