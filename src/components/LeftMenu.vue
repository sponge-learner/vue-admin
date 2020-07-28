<template>
	<el-menu router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" text-color="#fff" :collapse="isCollapse"
	 background-color=" rgb(51, 78, 102)" active-text-color="#ffd04b" style="height: calc(100vh - 60px);background-color: rgb(51, 78, 102);">
		<el-submenu v-for="(item,index) in menu" :index='item.id'>
			<template slot="title">
				<i :class='item.icon'></i>
				<span v-text="item.name"></span>
			</template>
			<el-menu-item-group >
				<el-menu-item v-for=" item in item.children " :index="item.path">
					<i :class='item.icon'></i>
					{{item.name}}
				</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>

<script>
	import { menu } from '@/api/index'
	import nav from '@/components/Nav.vue'
	import New from '@/new.js'
	export default {
		props: ['index', 'idx', 'isCollapse'],
		data() {
			return {
				menu: []
			}
		},
		async created() {
			// New.$on('getisshow',(data)=>{
			// 	this.isCollapse = data;
			// })
			var that = this;
			New.$on('updata', function(data) {
				that.menu.forEach((item, index) => {
					if (item.id == data.id) {
						item.icon = 'el-icon-' + data.icon_name;
						console.log(data);
						that.$set(menu, index, item);
					} else {
						item.children.forEach((child, index) => {
							if (child.id == data.id) {
								child.icon = 'el-icon-' + data.icon_name;
								console.log(data);
								that.$set(menu, index, child);
							}
						})
					}
				})
			})
			let id = sessionStorage.id;
			let { data } = await menu.leftMenu({ id })
			data.forEach((item) => {
				item.id = (item.id).toString();
				item.icon = 'el-icon-' + item.icon;
			})
			this.menu = data;
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style>

</style>

