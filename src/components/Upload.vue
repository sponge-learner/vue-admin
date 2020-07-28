<template>
	<el-upload class="avatar-uploader" action="/api/upload/avatar" :headers="headers"
	:show-file-list="false" :on-success="handleAvatarSuccess"  
	 :before-upload="beforeAvatarUpload">
		<template v-if="url">
			<img :src="url" class="avatar">
			<i @click.stop="removeUrl" class="el-icon-delete avatar-uploader-remove"></i>
		</template>
		<i v-else class="el-icon-plus avatar-uploader-icon"></i>
	</el-upload>
</template>

<script>
	import { upload } from '@/api/index';

	export default {
		props: ['url','oldurl'],
		data() {
			return {
				headers: {
					Authorization: `Bearer ${sessionStorage.token}`
				},
				isHandle: false
			}
		},
		methods: {
			removeUrl() {
				this.$emit('remove');
			},
			async handleRemove() {
				// 判断是否默认头像
				if (!this.isHandle) {
					return false;
				}
				let isDefault = this.url.indexOf('default') >= 0;
				if (isDefault) {
					return false;
				}
				let src = this.oldurl;
				console.log(src);
				let { status } = await upload.del({ src });
				if (status) {
					this.$message.success("删除成功！");
				}
			},
			handleAvatarSuccess(res, file, fileList) {
				console.log(res,file,fileList);
				this.isHandle = true;
				if (res.status) {
					this.$message.success(res.msg);
					this.$emit('success', res);
				}else{
					this.$message.success(res.msg);
				}
			},
			beforeAvatarUpload(res,file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		}
	}
</script>

<style scoped="scoped">
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon,
	.avatar-uploader-remove {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.avatar-uploader:hover .avatar-uploader-remove {
		display: block;
	}

	.avatar-uploader-remove {
		position: absolute;
		left: 0;
		top: 0;
		color: white;
		background-color: rgba(0, 0, 0, 0.7);
		display: none;
		z-index: 10;
	}
</style>
