<template>
	<div class="box" @mouseenter="isshow = true" @mouseleave="isshow = false">
		<div class="file el-icon-plus" v-show="!url">
			<input type="file" @change="upimg">
		</div>
		<img :src="url" style="width: 148px;height: 148px;" @change="upload">
		<div class="delete el-icon-delete" v-show="url&&isshow" @click="delurl">
		</div>
	</div>
</template>

<script>
	import { user } from '@/api/index'
	export default {
		props: ['oldurl', 'url'],
		data() {
			return {
				isshow: false,
				file: '',
			}
		},
		mounted() {
			var str = JSON.stringify(this.oldurl);
			this.oldimg = JSON.parse(str);
		},
		methods: {
			upimg(e) {
				var that = this;
				this.file = e.target.files[0];

				var reader = new FileReader();
				reader.readAsDataURL(this.file);
				reader.onload = function() {
					that.$emit('success', this.result);
				}
			},
			// 假删除
			delurl() {
				this.$emit('remove');
			},
			upload() {
				var that = this;
				let promise = new Promise(function(resolve, reject) {
					let formdata = new FormData();
					formdata.append('file', that.file);
					let res = user.upload({ ...formdata });
					console.log(res);
					if (res.status) {
						resolve(res);
					}
				})
				return promise;
			},
			async handleRemove() {
				// 判断是否默认头像		
				let isDefault = this.url.indexOf('default') >= 0;
				if (isDefault) {
					return false;
				}
				let src = this.oldimg.replace(/.+\/images/, './images');
				let { status } = await upload.del({ src });
				if (status) {
					this.$message.success("删除成功！");
				}
			},
		}
	}
</script>
<style scoped="scoped">
	.box {
		display: inline-block;
		width: 148px;
		height: 148px;
		border: 1px dashed #999999;
		position: relative;
	}

	input {
		width: 148px;
		height: 148px;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		cursor: pointer;
	}

	.file {
		width: 148px;
		height: 148px;
	}

	.el-icon-plus,
	.el-icon-delete {
		font-size: 20px;
		color: #8C939D;
		text-align: center;
		line-height: 148px;
	}

	.delete {
		font-size: 20px;
		width: 148px;
		height: 148px;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 200;
		position: absolute;
		top: 0;
		left: 0;
		color: white;
		cursor: pointer;
	}
</style>
